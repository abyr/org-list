import CacheableAdapter from './cachable-adapter.js';

/**
 * @typedef {{
 *   id: number,
 *   title: string,
 *   starred: boolean,
 *   position: number,
 *   completed: boolean,
 *   createdAt: number,
 *   updatedAt: number,
 *   }} Note
 */

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

            /**
             * @type {Note}
             */
            const newNote = { title, starred, position, completed };

            const isNew = !id;
            const date = new Date();
            const timestamp = +date;

            if (isNew) {
                newNote.createdAt = timestamp;
                newNote.completed = false;
            } else {
                newNote.id = id;
                newNote.updatedAt = timestamp;
            }

            this.idba.putRecord(this.name, newNote).then(res => {
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

}

export default NotesStoreAdapter;