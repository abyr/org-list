import CacheableAdapter from './cachable-adapter.js';

class PreferencesStoreAdapter extends CacheableAdapter {
    constructor() {
        super();
        
        this.name = 'preferences';
    }
}

export default PreferencesStoreAdapter;