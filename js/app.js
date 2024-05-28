import LayoutView from './layout-view.js';

const onWindowLoad = () => {
    console.log('onload');

    const appEl = document.querySelector('#main-container');

    const layout = new LayoutView({ element: appEl });

    layout.render();
};

window.addEventListener("load", onWindowLoad);