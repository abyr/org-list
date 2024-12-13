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
     * @param {Object} args
     * @param {string} args.startAt
     * @param {string} args.endAt
     * @returns {Promise<Repository.adapter.getAll|*[]>}
     */
    async search({ startAt, endAt }) {
        const allList = await this.getAll();

        if (!text) {
            return allList;
        }

        let filtered = [];

        if (startAt) {
            filtered = allList.filter(x => x.startAt > startAt);
        }
        if (endAt) {
            filtered = allList.filter(x => x.startEnd && x.startEnd < endAt);
        }

        return filtered;
    }

}

let timeLogsRepositoryInstance = Object.freeze(new TimeLogsRepository());


export default timeLogsRepositoryInstance;
