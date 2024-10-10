import LayoutView from './views/layout-view.js';
import sharedState from "./classes/shared-state.js";
import PreferencesStoreAdapter from './storage/preferences-adapter.js';

sharedState.setProp('debug', true);

const onWindowLoad = async () => {
    await setLastScheme();

    const appEl = document.querySelector('#org-list');

    const layout = new LayoutView({ element: appEl });

    await layout.asyncRender();
};

async function setLastScheme() {
    const preferrencesStoreAdapter = new PreferencesStoreAdapter();

    await preferrencesStoreAdapter.connect();

    const preferences = await preferrencesStoreAdapter.getAll();

    if (preferences.theme === 'dark') {
        document.querySelector('body').classList.add('dark');
    } else {
        document.querySelector('body').classList.remove('dark');
    }
}

window.addEventListener("load", onWindowLoad);