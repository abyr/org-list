import CacheableAdapter from './cachable-adapter.js';

class NotesStoreAdapter extends CacheableAdapter {
    constructor() {
        super();
        
        this.name = 'notes';
    }

    /**
     * @param {Number} id
     * 
     * @param {Object} [args]
     * @param {string} [args.title]
     * @param {boolean} [args.starred]
     * @param {number} [args.position] 
     * @param {boolean} [args.completed]
     * 
     * @returns {Promise}
     */
    put(id, { title, starred, position, completed }) {
        return new Promise((resolve, reject) => {

            this.invalidateCache();

            const fieldsData = { title, starred, position, completed };

            const isNew = !id;
            const date = new Date();
            const timestamp = +date;

            if (isNew) {
                fieldsData.createdAt = timestamp;
                fieldsData.completed = false;
            } else {
                fieldsData.id = id;
                fieldsData.updatedAt = timestamp;
            }

            this.idba.putRecord(this.name, fieldsData).then(res => {
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

}

export default NotesStoreAdapter;