import Repository from './repository.js';
import TimeLogsStoreAdapter from './time-logs-adapter.js';
import messageBus from '../classes/shared-message-bus.js';

let instance;
let timeLogsAdapter;

class TimeLogsRepository extends Repository {
    constructor() {
        if (instance) {
            throw new Error("Instance already exists");
        }

        super();

        instance = this;

        timeLogsAdapter = new TimeLogsStoreAdapter();
        this.setAdapter(timeLogsAdapter);

        messageBus.subscribe('timeLogs:updated', this.invalidateCacheData.bind(this));
    }

    /**
     * @param {Number} noteId
     * @param {Array} ids
     * @returns {Promise<Repository.adapter.getAll|*[]>}
     */
    async getNote({ noteId }) {
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

let timeLogsRepositoryInstance = Object.freeze(new TimeLogsRepository());


export default timeLogsRepositoryInstance;
