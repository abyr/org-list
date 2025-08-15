import { describe, it, expect, should, beforeEach, vi } from 'vitest';
import View from '../../js/classes/view.js';
import sharedState from '../../js/classes/shared-state.js';


describe('View', () => {
    let view;
    let mockElement;

    beforeEach(() => {
        const cardEl = document.createElement('div');
        mockElement = document.createElement('div');

        cardEl.classList.add('card');
        mockElement.appendChild(cardEl);

        view = new View({ element: mockElement});
    });

    it('queue element', () => {
        const el = view.queue('.card');

        expect(el).toBeInstanceOf(Element);
    });

    it('queueAll elements', () => {
        const els = view.queueAll('.card');

        expect(els).length(1);
    });

    it('render', () => {
        view.getHtml = vi.fn().mockReturnValue('<div class="bar">Mock HTML</div>');
        view.render();

        const els = view.queueAll('.bar');

        expect(els).length(1);
    });

    it('render debug', () => {
        sharedState.setProp('debug', true);
        view.getHtml = vi.fn().mockReturnValue('<div class="bar">Mock HTML</div>');
        view.render();

        const els = view.queueAll('.bar');

        expect(els).length(1);
    });

    it('getHtml', () => {
        const html = view.getHtml();

        expect(html).toContain('data-view-id');
        expect(html).toContain(view.getUid());
    });

    it('destroy', () => {
        view.cleanup = vi.fn();
        view.destroy();

        expect(view.cleanup).toHaveBeenCalled();
        expect(view.eventSubscribersMap).toBeNull();
    });

    it('cleanup', () => {
        view.unsubscribeAllEvents = vi.fn();
        view.cleanup();

        expect(view.unsubscribeAllEvents).toHaveBeenCalled();
    });

    it('subscribeElementEvent', () => {
        const mockSubscriber = vi.fn();
        const mockElement = document.createElement('div');

        view.subscribeElementEvent(mockElement, 'click', mockSubscriber);

        expect(view.eventSubscribersMap['click']).toHaveLength(1);
        expect(view.eventSubscribersMap['click'][0].element).toBe(mockElement);
        expect(view.eventSubscribersMap['click'][0].subscriber).toBe(mockSubscriber);
    });

    it('subscribeElementEvent no map', () => {
        const mockSubscriber = vi.fn();
        const mockElement = document.createElement('div');

        view.eventSubscribersMap = null;
        view.subscribeElementEvent(mockElement, 'click', mockSubscriber);

        expect(view.eventSubscribersMap['click']).toHaveLength(1);
        expect(view.eventSubscribersMap['click'][0].element).toBe(mockElement);
        expect(view.eventSubscribersMap['click'][0].subscriber).toBe(mockSubscriber);
    });

    it('subscribeElementEvent no element', () => {
        const mockSubscriber = vi.fn();

        view.subscribeElementEvent(null, 'click', mockSubscriber);

        expect(view.eventSubscribersMap).toEqual({});
    });

    it('subscribeElementEvent no subscriber', () => {
        const mockElement = document.createElement('div');

        view.subscribeElementEvent(mockElement, 'click', null);

        expect(view.eventSubscribersMap).toEqual({});
    });

    it('unsubscribeAllEvents', () => {
        const mockElement = document.createElement('div');
        const mockSubscriber = vi.fn();

        view.subscribeElementEvent(mockElement, 'click', mockSubscriber);
        view.unsubscribeAllEvents();

        expect(view.eventSubscribersMap).toEqual({});
    });

    it('unsubscribeAllEvents no map', () => {
        const mockElement = document.createElement('div');
        const mockSubscriber = vi.fn();

        view.subscribeElementEvent(mockElement, 'click', mockSubscriber);

        view.eventSubscribersMap = null;

        view.unsubscribeAllEvents();

        expect(view.eventSubscribersMap).toEqual(null);
    });

});