import PubSub from './pub-sub.js';

let instance;
let _pubSub;

class SharedMessageBus {

    constructor() {
        if (instance) {
            throw new Error("Instance already exists");
        }

        instance = this;

        _pubSub = new PubSub();
    }

    subscribe(messageName, subscriber){
        _pubSub.subscribe(messageName, subscriber);
    }

    unsubscribe(messageName, subscriber){
        _pubSub.unsubscribe(messageName, subscriber);
    }

    publish(messageName, payload){
        _pubSub.publish(messageName, payload);
    }
}

let sharedMessageBusInstance = Object.freeze(new SharedMessageBus());


export default sharedMessageBusInstance;