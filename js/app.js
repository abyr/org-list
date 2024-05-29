import LayoutView from './layout-view.js';

const onWindowLoad = async () => {
    const appEl = document.querySelector('#org-list');

    const layout = new LayoutView({ element: appEl });

    await layout.init();

    layout.asyncRender();
};

window.addEventListener("load", onWindowLoad);