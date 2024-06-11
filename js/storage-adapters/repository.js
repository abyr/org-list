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

    async getAll() {
        if (!this.cacheMap['all']) {
            await this.init();
            this.cacheMap['all'] = await this.adapter.getAll();
        }

        return this.cacheMap['all'];
    }

    invalidateCache() {
        Object.keys(this.cacheMap).forEach(key => {
            this.cacheMap[key] = null;
        });
    }
}

export default Repository;
