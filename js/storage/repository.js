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

    async get(id) {
        const numId = Number(id);

        if (!this.cacheMap[numId]) {
            await this.init();
            this.cacheMap[numId] = await this.adapter.get(numId);
        }

        return this.cacheMap[numId];
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
        const res = await this.adapter.put(Number(id), data);

        this.invalidateCache();
        return res;
    }

    async delete(id){
        const res = await this.adapter.delete(Number(id));

        this.invalidateCache();

        return res;
    }

    invalidateCacheData(data) {
        if (data && data.id) {
            this.cacheMap[Number(data.id)] = null;
        }
    }

    invalidateCache() {
        Object.keys(this.cacheMap).forEach(id => {
            if (id === 'all') {
                this.cacheMap[id] = null;
            } else {
                delete this.cacheMap[Number(id)];
            }
        });
    }
}

export default Repository;
