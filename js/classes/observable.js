/**
 * Usage example:
 *
 * const observable = new Observable();
 *
 * const observer = data => console.log(`Observer: ${data}`);
 *
 * observable.subscribe(observer);
 *
 * observable.notify('update');
 *
 * observable.unsubscribe(observer);
 */
class Observable {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(subscriber => subscriber !== observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer(data));
    }
}

export default Observable;