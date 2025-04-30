import { describe, it, expect, beforeEach, vi } from 'vitest';
import AsyncView from '../../js/classes/async-view.js';

describe('AsyncView', () => {
    let asyncView;
    let mockElement;

    beforeEach(() => {
        mockElement = document.createElement('div');
        asyncView = new AsyncView({ element: mockElement});

        asyncView.postRender = vi.fn();
        asyncView.applyEvents = vi.fn();
        asyncView.getHtml = vi.fn().mockReturnValue('<div>Mock HTML</div>');
    });

    it('should render async HTML and call postRender and applyEvents', async () => {
        await asyncView.asyncRender();

        expect(mockElement.innerHTML).toBe('<div>Mock HTML</div>');

        expect(asyncView.postRender).toHaveBeenCalled();
        expect(asyncView.applyEvents).toHaveBeenCalled();
    });

    it('should call getAsyncHtml and return the correct HTML', async () => {
        const html = await asyncView.getAsyncHtml();
        expect(html).toBe('<div>Mock HTML</div>');
    });
});