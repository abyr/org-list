let sharedState = {};
let instance;

class SharedState {

    constructor() {
        if (instance) {
            throw new Error("Instance already exists");
        }

        instance = this;
    }

    incProp(name) {
        let value = Number(this.getProp(name));

        if (Number.isNaN(value)) {
            this.setProp(name, 1);
        } else {
            this.setProp(name, value + 1);
        }

        const res = this.getProp(name);

        return Number(res);
    }

    setProp(name, value) {
        sharedState[name] = value;
    }

    getProp(name) {
        return sharedState[name];
    }

}

let sharedStateInstance = Object.freeze(new SharedState());


export default sharedStateInstance;