import { describe, it, expect, should, beforeEach, vi } from 'vitest';
import View from '../../js/classes/view.js';


describe('View', () => {
    let view;
    let mockElement;

    beforeEach(() => {
        const cardEl = document.createElement('div');
        mockElement = document.createElement('div');

        cardEl.classList.add('card');
        mockElement.appendChild(cardEl);

        view = new View({ element: mockElement});

        view.postRender = vi.fn();
        view.applyEvents = vi.fn();
        view.getHtml = vi.fn().mockReturnValue('<div>Mock HTML</div>');
    });

    it('queue element', () => {
        const el = view.queue('.card');

        expect(el).toBeInstanceOf(Element);
    });

    it('queueAll elements', () => {
        const els = view.queueAll('.card');

        expect(els).length(1);
    });
});