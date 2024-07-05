import CacheableAdapter from './cachable-adapter.js';

/**
 * @typedef {{
 *   title: string,
 *   notes: array,
 *   orderBy: string,
 *   sortBy: string,
 *   archived: boolean,
 *   createdAt: number,
 *   updatedAt: number,
 * }} ListObject
 */

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
     * @param {boolean} [args.archived]
     * @param {string} [args.createdAt]
     *
     * @returns {Promise}
     */
    put(id, {
        title,
        notes = [],
        sortBy,
        orderBy,
        archived = false,
        createdAt
    }) {
        return new Promise((resolve, reject) => {

            this.invalidateCache();

            /**
             * @type {ListObject}
             */
            const listObject = {
                title,
                notes,
                sortBy,
                orderBy,
                archived,
                createdAt,
            };

            const isNew = !id;
            const date = new Date();
            const timestamp = +date;

            if (isNew) {

                if (!title) {
                    return reject('Title is required');
                }

                listObject.createdAt = timestamp;
                listObject.sortBy = 'title';
                listObject.orderBy = 'asc';
            } else {
                listObject.id = id;
                listObject.updatedAt = timestamp;
            }

            this.idba.putRecord(this.name, listObject).then(res => {
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }
}

export default ListsStoreAdapter;