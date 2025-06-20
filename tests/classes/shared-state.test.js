import { describe, it, expect, beforeEach, vi } from 'vitest';
import sharedState1 from '../../js/classes/shared-state.js';
import sharedState2 from '../../js/classes/shared-state.js';

describe('SharedMessageBus', () => {

    it('should defaults to undefined', () => {
        expect(sharedState1.getProp('prop1')).toBeUndefined;
    });

    it('should incProp', () => {
        const propName = 'prop2';

        sharedState1.incProp(propName);
        expect(sharedState2.getProp(propName)).toEqual(1);

        sharedState2.incProp(propName);
        expect(sharedState1.getProp('prop2')).toEqual(2);
    });

    it('should setProp', () => {
        const propName = 'prop3';

        sharedState1.setProp(propName, 3);
        expect(sharedState2.getProp(propName)).toEqual(3);

        sharedState2.incProp(propName);
        expect(sharedState1.getProp(propName)).toEqual(4);
    });

});