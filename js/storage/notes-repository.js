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

        messageBus.subscribe('note:updated', this.invalidateCacheData.bind(this));
    }

    /**
     * @param {String} text
     * @returns {Promise<Repository.adapter.getAll|*[]>}
     */
    async search({ text }) {
        const allNotes = await this.getAll();

        if (!text) {
            return allNotes;
        }

        let filtered = [];

        if (text) {
            filtered = allNotes.filter(x => x.title.indexOf(text) > -1);
        }

        return filtered;
    }

}

let notesRepositoryInstance = Object.freeze(new NotesRepository());


export default notesRepositoryInstance;
