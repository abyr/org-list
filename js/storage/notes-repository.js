import Repository from './repository.js';
import NotesStoreAdapter from './notes-adapter.js';
import messageBus from '../classes/shared-message-bus.js';

let instance;
let notesAdapter;

class NotesRepository extends Repository {

    constructor() {
        if (instance) {
            throw new Error("Instance already exists");
        }

        super();

        instance = this;

        notesAdapter = new NotesStoreAdapter();

        this.setAdapter(notesAdapter);

        messageBus.subscribe('note:updated', this.invalidateCache.bind(this));
    }

}

let notesRepositoryInstance = Object.freeze(new NotesRepository());


export default notesRepositoryInstance;
