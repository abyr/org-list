import LayoutView from './views/layout-view.js';
import sharedState from "./classes/shared-state.js";

sharedState.debug = true

const onWindowLoad = async () => {
    const appEl = document.querySelector('#org-list');

    const layout = new LayoutView({ element: appEl });

    await layout.asyncRender();
};

window.addEventListener("load", onWindowLoad);