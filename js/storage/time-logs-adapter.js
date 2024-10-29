import CacheableAdapter from './cachable-adapter.js';

/**
 * @typedef {{
 *   id: number,
 *   noteId: number,
 *   startAt: number,
 *   endAt: number,
 * }} TimeLogObject
 */

class TimeLogsStoreAdapter extends CacheableAdapter {
    constructor() {
        super();
        
        this.name = 'timeLogs';
    }

    /**
     * 
     * @param {Number} id 
     * 
     * @param {Object} [args]
     * @param {number} [args.noteId]
     * @param {number} [args.startAt]
     * @param {number} [args.endAt]
     * @returns 
     */
    put(id, {
        noteId,
        startAt,
        endAt = null,
    }) {
        return new Promise((resolve, reject) => {
            this.invalidateCache();

            if (endAt !== null) {
                return reject();
            }

            /**
             * @type {TimeLogObject}
             */
            const timeLogObject = { noteId, startAt, endAt };

            const isNew = !id;

            if (isNew) {
                if (!noteId) {
                    return reject('noteId is required');
                }

                if (!startAt) {
                    return reject('startAt is required');
                }

            } else if (!endAt) {
                return reject('endAt is required');
            }

            this.idba.putRecord(this.name, timeLogObject).then(res => {
                resolve(res);

            }).catch(err => {
                console.error(err);
                reject(err);
            });
            
        });
    }
}

export default TimeLogsStoreAdapter;