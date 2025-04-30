import { describe, it, expect, beforeEach, vi } from 'vitest';
import sharedMessageBus1 from '../../js/classes/shared-message-bus.js';
import sharedMessageBus2 from '../../js/classes/shared-message-bus.js';

describe('SharedMessageBus', () => {

    it('should subscribe to a message', () => {
        const subscriber = vi.fn();

        sharedMessageBus2.subscribe('testMessage', subscriber);
        sharedMessageBus1.publish('testMessage', "payload");
        sharedMessageBus2.unsubscribe('testMessage', subscriber);

        expect(subscriber).toHaveBeenCalledWith("payload");
    });


    it('should unsubscribe to a message', () => {
        const subscriber = vi.fn();

        sharedMessageBus2.subscribe('testMessage', subscriber);
        sharedMessageBus1.publish('testMessage', "payload");

        sharedMessageBus2.unsubscribe('testMessage', subscriber);
        sharedMessageBus1.publish('testMessage', "payload");

        expect(subscriber).toBeCalledTimes(1);
    });

});