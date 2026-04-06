import * as layoutRenderer from "./utilities/layoutRenderer.js"
import * as update from "./utilities/updater.js"
import * as tooltip from "./utilities/tooltip.js"
import * as landingPage from "./pages/landingPage.js"
import * as serverLogic from "./utilities/serverLogic.js"
import * as lookup from "./utilities/lookup.js"
import * as saveLoad from "./utilities/saveLoad.js"



document.addEventListener("DOMContentLoaded", function () {
    landingPage.create(10,10)

    update.onPageLoad()
});
