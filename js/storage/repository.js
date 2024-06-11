class Repository {
    constructor() {
        this.cacheMap = {};
        this.adapter = null;
    }

    setAdapter(adapter) {
        this.adapter = adapter;
    }

    async init() {
        this.invalidateCache();

        await this.adapter.connect();
    }

    async get(key) {
        if (!this.cacheMap[key]) {
            await this.init();
            this.cacheMap[key] = await this.adapter.get(key);
        }

        return this.cacheMap[key];
    }

    async getAll() {
        if (!this.cacheMap['all']) {
            await this.init();
            this.cacheMap['all'] = await this.adapter.getAll();
        }

        return this.cacheMap['all'];
    }

    async create(data){
        const res = await this.adapter.put(null, data);

        this.invalidateCache();

        return res;
    }

    async update(id, data){
        const res = await this.adapter.put(id, data);

        this.invalidateCache();

        return res;
    }

    async delete(id){
        const res = await this.adapter.delete(id);

        this.invalidateCache();

        return res;
    }

    invalidateCacheData(data) {
        if (data && data.id) {
            this.cacheMap[data.id] = null;
        }
    }

    invalidateCache() {
        Object.keys(this.cacheMap).forEach(key => {
            this.cacheMap[key] = null;
        });
    }
}

export default Repository;
