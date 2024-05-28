import CacheableAdapter from './cachable-adapter.js';

class ListsStoreAdapter extends CacheableAdapter {
    constructor() {
        super();
        
        this.name = 'lists';
    }

    /**
     * @param {Number} id
     * 
     * @param {Object} [args]
     * @param {string} [args.title]
     * @param {array} [args.notes]
     * @param {string} [args.sortBy] field name
     * @param {string} [args.orderBy] asc, desc
     * @param {boolean} [args.completed]
     * @param {string} [args.createdAt] ISO 8601 timestamp
     * @param {string} [args.updatedAt] ISO 8601 timestamp
     * 
     * @returns {Promise}
     */
    put(id, { title, notes, sortBy, orderBy, completed, createdAt, updatedAt }) {
        return new Promise((resolve, reject) => {

            this.invalidateCache();

            this.idba.putRecord(this.name, {
                id,
                title,
                notes,
                sortBy,
                orderBy,
                completed,
                createdAt,
                updatedAt
            }).then(res => {
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }
}

export default ListsStoreAdapter;