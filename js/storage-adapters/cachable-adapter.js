import CacheableStorageAdapter from '../../deps/client-side-storage/src/adapter/cacheable-storage-adapter.js';
import dbData from "./db-data.js";

class CacheableAdapter extends CacheableStorageAdapter {

    async connect() {
        return await super.connect(dbData);
    }
}

export default CacheableAdapter;