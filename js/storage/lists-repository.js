import Repository from './repository.js';
import ListsStoreAdapter from './lists-adapter.js';
import messageBus from '../classes/shared-message-bus.js';

let instance;
let listsAdapter;

class ListsRepository extends Repository {
    constructor() {
        if (instance) {
            throw new Error("Instance already exists");
        }

        super();

        instance = this;

        listsAdapter = new ListsStoreAdapter();
        this.setAdapter(listsAdapter);

        messageBus.subscribe('list:updated', this.invalidateCache.bind(this));
    }
}

let listsRepositoryInstance = Object.freeze(new ListsRepository());


export default listsRepositoryInstance;
