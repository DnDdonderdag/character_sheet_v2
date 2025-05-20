import * as playground from "./pages/playgroundGen.js"
import * as tooltip from "./utilities/tooltip.js"
import * as update from "./utilities/updater.js";

document.addEventListener("DOMContentLoaded", function () {
    playground.generatePlayground()
    update.onPageLoad()
});

