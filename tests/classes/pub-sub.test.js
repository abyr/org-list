import { describe, it, expect, beforeEach, vi } from 'vitest';
import PubSub from '../../js/classes/pub-sub.js';


describe('PubSub', () => {
    let pubSub;
    let subscriber;

    beforeEach(() => {
        pubSub = new PubSub();
        subscriber = vi.fn();
    });

    it('should subscribe to a message', () => {
        pubSub.subscribe('update', subscriber);
        expect(pubSub.messageSubscribersMap['update']).toContain(subscriber);
    });

    it('should throw an error when subscribing a non-function', () => {
        expect(() => pubSub.subscribe('update', 'not a function')).toThrow('string is not a function.');
    });

    it('should publish a message to subscribers', () => {
        pubSub.subscribe('update', subscriber);
        pubSub.publish('update', { data: 1 });
        expect(subscriber).toHaveBeenCalledWith({ data: 1 });
    });

    it('should not call subscribers if no subscribers are registered', () => {
        pubSub.publish('update', { data: 1 });
        expect(subscriber).not.toHaveBeenCalled();
    });

    it('should unsubscribe from a message', () => {
        pubSub.subscribe('update', subscriber);
        pubSub.unsubscribe('update', subscriber);
        pubSub.publish('update', { data: 1 });
        expect(subscriber).not.toHaveBeenCalled();
    });

    it('should not throw an error when unsubscribing a non-function', () => {
        expect(() => pubSub.unsubscribe('update', 'not a function')).toThrow('string is not a function.');
    });

    it('should handle multiple subscribers for the same message', () => {
        const subscriber2 = vi.fn();
        pubSub.subscribe('update', subscriber);
        pubSub.subscribe('update', subscriber2);
        pubSub.publish('update', { data: 1 });
        expect(subscriber).toHaveBeenCalledWith({ data: 1 });
        expect(subscriber2).toHaveBeenCalledWith({ data: 1 });
    });

    it('should unsubscribe only the specified subscriber', () => {
        const subscriber2 = vi.fn();
        pubSub.subscribe('update', subscriber);
        pubSub.subscribe('update', subscriber2);
        pubSub.unsubscribe('update', subscriber);
        pubSub.publish('update', { data: 1 });
        expect(subscriber).not.toHaveBeenCalled();
        expect(subscriber2).toHaveBeenCalledWith({ data: 1 });
    });

    it('should unsubscribe empty', () => {
        const subscriber2 = vi.fn();
        pubSub.unsubscribe('update', subscriber);
        pubSub.publish('update', { data: 1 });
        expect(subscriber).not.toHaveBeenCalled();
    });
});