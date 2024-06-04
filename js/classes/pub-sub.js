class PubSub {

    constructor() {
        this.messageSubscribersMap = {};
    }

    subscribe(messageName, subscriber) {
        if (typeof subscriber !== 'function') {
            throw new Error(`${typeof subscriber} is not a function.`);
        }

        const subscribers = this.messageSubscribersMap[messageName];

        if (subscribers) {
            this.messageSubscribersMap[messageName] = [...subscribers, subscriber];
        } else {
            this.messageSubscribersMap[messageName] = [subscriber];
        }
    }

    unsubscribe(messageName, subscriber){
        if (typeof subscriber !== 'function') {
            throw new Error(`${typeof subscriber} is not a function.`);
        }

        const subscribers = this.messageSubscribersMap[messageName];

        if (!subscribers) {
            return;
        }

        this.messageSubscribersMap[messageName] = subscribers.filter(x => x !== subscriber);
    }

    publish(messageName, payload){
        const subscribers = this.messageSubscribersMap[messageName];

        if (!subscribers) {
            return;
        }

        subscribers.forEach(x => x(payload));
    }
}

export default PubSub;