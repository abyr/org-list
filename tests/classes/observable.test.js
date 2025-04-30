import { describe, it, expect, vi, beforeEach } from 'vitest';
import Observable from '../../js/classes/observable.js';

describe('Observable', () => {

    it('should subscribe an observer', () => {
        const observable = new Observable();
        const observer1 = vi.fn();
        observable.subscribe(observer1);
        expect(observable.observers).toContain(observer1);
    });

    it('should notify all subscribed observers', () => {
        const observable = new Observable();
        const observer1 = vi.fn();
        const observer2 = vi.fn();

        observable.subscribe(observer1);
        observable.subscribe(observer2);

        observable.notify('update');

        expect(observer1).toHaveBeenCalledWith('update');
        expect(observer2).toHaveBeenCalledWith('update');
    });

    it('should unsubscribe an observer', () => {
        const observable = new Observable();
        const observer1 = vi.fn();
        const observer2 = vi.fn();

        observable.subscribe(observer1);
        observable.subscribe(observer2);
        observable.unsubscribe(observer1);

        observable.notify('update');

        expect(observer1).not.toHaveBeenCalled();
        expect(observer2).toHaveBeenCalledWith('update');
    });

    it('should not throw an error when unsubscribing an observer that is not subscribed', () => {
        const observable = new Observable();
        const observer1 = vi.fn();
        const observer2 = vi.fn();

        observable.subscribe(observer1);
        observable.unsubscribe(observer2);

        expect(() => observable.notify('update')).not.toThrow();
        expect(observer1).toHaveBeenCalledWith('update');
    });
});
