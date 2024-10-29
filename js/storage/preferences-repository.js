import Repository from './repository.js';
import PreferencesStoreAdapter from './preferences-adapter.js';
import messageBus from '../classes/shared-message-bus.js';

let instance;
let preferencesAdapter;

class PreferencesRepository extends Repository {
    constructor() {
        if (instance) {
            throw new Error("Instance already exists");
        }

        super();

        instance = this;

        preferencesAdapter = new PreferencesStoreAdapter();
        this.setAdapter(preferencesAdapter);

        messageBus.subscribe('preferences:updated', this.invalidateCacheData.bind(this));
    }

    getStrictId(id) {
        return String(id);
    }
}

let preferencesRepositoryInstance = Object.freeze(new PreferencesRepository());

export default preferencesRepositoryInstance;
