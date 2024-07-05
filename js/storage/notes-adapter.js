import CacheableAdapter from './cachable-adapter.js';

/**
 * @typedef {{
 *   id: number,
 *   title: string,
 *   description: string,
 *   starred: boolean,
 *   position: number,
 *   completed: boolean,
 *   createdAt: number,
 *   updatedAt: number,
 *   }} NoteObject
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
    put(id, {
        title,
        description = '',
        starred= false,
        position,
        completed= false,
    }) {
        return new Promise((resolve, reject) => {

            this.invalidateCache();

            /**
             * @type {NoteObject}
             */
            const noteObject = { title, description, starred, position, completed };

            const isNew = !id;
            const date = new Date();
            const timestamp = +date;

            if (isNew) {

                if (!title) {
                    return reject('Title is required');
                }

                noteObject.createdAt = timestamp;
                noteObject.completed = false;
            } else {
                noteObject.id = id;
                noteObject.updatedAt = timestamp;
            }

            this.idba.putRecord(this.name, noteObject).then(res => {
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }

}

export default NotesStoreAdapter;