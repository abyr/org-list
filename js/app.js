import LayoutView from './views/layout-view.js';

const onWindowLoad = async () => {
    const appEl = document.querySelector('#org-list');

    const layout = new LayoutView({ element: appEl });

    await layout.asyncRender();
};

window.addEventListener("load", onWindowLoad);