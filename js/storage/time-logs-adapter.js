import CacheableAdapter from './cachable-adapter.js';

/**
 * @typedef {{
 *   id: number,
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
     * @param {number} [args.startAt]
     * @param {number} [args.endAt]
     * @param {String} [comment]
     * @returns 
     */
    put(id, {
        startAt,
        endAt = null,
        comment = ''
    }) {
        return new Promise((resolve, reject) => {
            this.invalidateCache();

            /**
             * @type {TimeLogObject}
             */
            const timeLogObject = { id, startAt, endAt, comment };

            const isNew = !id;

            if (isNew) {
                if (!startAt) {
                    return reject('startAt is required');
                }
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