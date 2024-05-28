import View from './view.js';

/**
 * Uses element as parent element for rendering
 */
class AsyncView extends View {

    async asyncRender() {
        const html = await this.getAsyncHtml();

        this.element.innerHTML = html;
    }

    getAsyncHtml() {
        return Promise.resolve(this.getHtml());
    }

}

export default AsyncView;