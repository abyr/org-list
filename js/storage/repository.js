class Repository {
    constructor() {
        this.cacheMap = {};
        this.adapter = null;
    }

    setAdapter(adapter) {
        this.adapter = adapter;
    }

    async lazyInit() {
        if (!this.cacheMap['all']) {
            await this.init();
            this.cacheMap['all'] = await this.adapter.getAll();
        }
    }

    async init() {
        this.invalidateCache();

        await this.adapter.connect();
    }

    async get(id) {
        const strictId = this.getStrictId(id);

        if (!this.cacheMap[strictId]) {
            await this.init();
            this.cacheMap[strictId] = await this.adapter.get(strictId);
        }

        return this.cacheMap[strictId];
    }

    async getAll() {
        await this.lazyInit();

        return this.cacheMap['all'];
    }

    async create(data){
        const res = await this.adapter.put(null, data);

        this.invalidateCache();

        return res;
    }

    async update(id, data){
        await this.lazyInit();
        const res = await this.adapter.put(this.getStrictId(id), data);

        this.invalidateCache();
        return res;
    }

    async delete(id){
        const res = await this.adapter.delete(this.getStrictId(id));

        this.invalidateCache();

        return res;
    }

    invalidateCacheData(data) {
        if (data && data.id) {
            this.cacheMap[this.getStrictId(data.id)] = null;
        }
    }

    invalidateCache() {
        Object.keys(this.cacheMap).forEach(id => {
            if (id === 'all') {
                this.cacheMap[id] = null;
            } else {
                delete this.cacheMap[this.getStrictId(id)];
            }
        });
    }

    /**
     * @param id
     * @returns {any}
     */
    getStrictId(id) {
        return Number(id);
    }
}

export default Repository;
