import LayoutView from './views/layout-view.js';
import sharedState from "./classes/shared-state.js";
import preferencesRepository from './storage/preferences-repository.js';

sharedState.setProp('debug', true);

const onWindowLoad = async () => {
    await setLastScheme();

    const appEl = document.querySelector('#org-list');

    const layout = new LayoutView({ element: appEl });

    await layout.asyncRender();
};

async function setLastScheme() {
    const theme = await preferencesRepository.get('theme');

    if (theme && theme.value === 'dark') {
        setDarkTheme();

    } else if (theme && theme.value === 'light') {
        setLightTheme();

    } else {
        setLightTheme();
    }
}

function setLightTheme() {
    document.querySelector('body').classList.remove('dark');
}

function setDarkTheme() {
    document.querySelector('body').classList.add('dark');
}

window.addEventListener("load", onWindowLoad);