export class FloatingWindow {
	constructor(master) {
		this.master = master
		this.floatingWindows = {}
		this.topZIndex = 10000
	}

	bringToFront(container) {
		this.topZIndex += 1
		container.style.zIndex = `${this.topZIndex}`
	}

	createFloatingWindow(windowKey, title, onCreate) {
		if (!windowKey) {
			throw new Error("windowKey is required")
		}

		const existingWindow = this.floatingWindows[windowKey]
		if (existingWindow) {
			return existingWindow.api
		}

		const parent = document.querySelector(".containerWrapper") || document.body

		const container = document.createElement("div")
		container.className = "floatingContainer"
		const windowCount = Object.keys(this.floatingWindows).length
		const initialOffset = 20 * windowCount
		container.style.left = `${80 + initialOffset}px`
		container.style.top = `${80 + initialOffset}px`
		this.bringToFront(container)
		container.id = `${windowKey}Container`

		container.addEventListener("pointerdown", () => {
			this.bringToFront(container)
		})

		const dragHandle = document.createElement("div")
		dragHandle.className = "dragHandle"

		const titleElement = document.createElement("span")
		titleElement.textContent = title
		dragHandle.appendChild(titleElement)

		const closeButton = document.createElement("button")
		closeButton.type = "button"
		closeButton.textContent = "×"
		closeButton.style.marginLeft = "auto"
		closeButton.style.cursor = "pointer"
		closeButton.addEventListener("pointerdown", (event) => {
			event.stopPropagation()
		})
		dragHandle.appendChild(closeButton)

		container.appendChild(dragHandle)

		const content = document.createElement("div")
		content.className = "floatingContent"
		content.id = windowKey
		container.appendChild(content)

		const resizeHandle = document.createElement("div")
		resizeHandle.className = "resizeHandle"
		container.appendChild(resizeHandle)

		this.makeDraggable(container, dragHandle)
		this.makeResizable(container, resizeHandle)

		parent.appendChild(container)

		const api = {
			key: windowKey,
			isOpen: () => {
				return container.classList.contains("active")
			},
			open: () => {
				container.classList.add("active")
			},
			close: () => {
				container.remove()
				delete this.floatingWindows[windowKey]
			},
			destroy: () => {
				api.close()
			},
			setTitle: (newTitle) => {
				titleElement.textContent = newTitle
			},
			getContent: () => content,
			getContainer: () => container,
		}

		closeButton.addEventListener("click", (event) => {
			event.stopPropagation()
			api.close()
		})

		this.floatingWindows[windowKey] = {
			container,
			dragHandle,
			content,
			closeButton,
			resizeHandle,
			titleElement,
			api,
		}

		if (typeof onCreate === "function") {
			onCreate({ container, dragHandle, content, closeButton, resizeHandle, api, key: windowKey })
		}

		return api
	}

	getFloatingWindow(windowKey) {
		return this.floatingWindows[windowKey]?.api || null
	}

	getFloatingWindowContent(windowKey) {
		return this.floatingWindows[windowKey]?.content || null
	}

	openFloatingWindow(windowKey) {
		const floatingWindow = this.getFloatingWindow(windowKey)
		if (floatingWindow) {
			floatingWindow.open()
		}
	}

	closeFloatingWindow(windowKey) {
		const floatingWindow = this.getFloatingWindow(windowKey)
		if (floatingWindow) {
			floatingWindow.close()
		}
	}

	toggleFloatingWindow(windowKey, enabled) {
		if (enabled) {
			this.openFloatingWindow(windowKey)
			return
		}
		this.closeFloatingWindow(windowKey)
	}

	destroyFloatingWindow(windowKey) {
		const floatingWindow = this.getFloatingWindow(windowKey)
		if (floatingWindow) {
			floatingWindow.destroy()
		}
	}

	closeAllFloatingWindows() {
		for (const windowKey of Object.keys(this.floatingWindows)) {
			this.closeFloatingWindow(windowKey)
		}
	}

	makeDraggable(container, handle) {
		let dragging = false
		let startX = 0
		let startY = 0
		let startLeft = 0
		let startTop = 0

		handle.addEventListener("pointerdown", (event) => {
			this.bringToFront(container)
			dragging = true
			startX = event.clientX
			startY = event.clientY

			const rect = container.getBoundingClientRect()
			startLeft = rect.left
			startTop = rect.top

			handle.setPointerCapture(event.pointerId)
		})

		handle.addEventListener("pointermove", (event) => {
			if (!dragging) return

			const dx = event.clientX - startX
			const dy = event.clientY - startY

			const maxLeft = window.innerWidth - container.offsetWidth
			const maxTop = window.innerHeight - container.offsetHeight

			const nextLeft = Math.min(Math.max(0, startLeft + dx), Math.max(0, maxLeft))
			const nextTop = Math.min(Math.max(0, startTop + dy), Math.max(0, maxTop))

			container.style.left = `${nextLeft}px`
			container.style.top = `${nextTop}px`
		})

		const stopDrag = (event) => {
			if (!dragging) return
			dragging = false
			if (event && event.pointerId !== undefined) {
				handle.releasePointerCapture(event.pointerId)
			}
		}

		handle.addEventListener("pointerup", stopDrag)
		handle.addEventListener("pointercancel", stopDrag)
	}

	makeResizable(container, handle) {
		let resizing = false
		let startX = 0
		let startY = 0
		let startWidth = 0
		let startHeight = 0

		handle.addEventListener("pointerdown", (event) => {
			event.stopPropagation()
			event.preventDefault()

			resizing = true
			startX = event.clientX
			startY = event.clientY

			const rect = container.getBoundingClientRect()
			startWidth = rect.width
			startHeight = rect.height

			handle.setPointerCapture(event.pointerId)
		})

		handle.addEventListener("pointermove", (event) => {
			if (!resizing) return

			const dx = event.clientX - startX
			const dy = event.clientY - startY

			const minWidth = 280
			const minHeight = 160

			const rect = container.getBoundingClientRect()
			const maxWidth = Math.max(minWidth, window.innerWidth - rect.left - 10)
			const maxHeight = Math.max(minHeight, window.innerHeight - rect.top - 10)

			const nextWidth = Math.min(Math.max(minWidth, startWidth + dx), maxWidth)
			const nextHeight = Math.min(Math.max(minHeight, startHeight + dy), maxHeight)

			container.style.width = `${nextWidth}px`
			container.style.height = `${nextHeight}px`
		})

		const stopResize = (event) => {
			if (!resizing) return
			resizing = false
			if (event && event.pointerId !== undefined) {
				handle.releasePointerCapture(event.pointerId)
			}
		}

		handle.addEventListener("pointerup", stopResize)
		handle.addEventListener("pointercancel", stopResize)
	}
}
