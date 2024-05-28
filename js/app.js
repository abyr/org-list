import LayoutView from './layout-view.js';

const onWindowLoad = async () => {
    console.log('onload');

    const appEl = document.querySelector('#main-container');

    const layout = new LayoutView({ element: appEl });

    await layout.init();

    layout.asyncRender();
};

window.addEventListener("load", onWindowLoad);