import View from './view.js';

/**
 * Uses element as parent element for rendering
 */
class AsyncView extends View {

    async asyncRender() {
        this.element.innerHTML = await this.getAsyncHtml();

        this.postRender();

        this.applyEvents();
    }

    getAsyncHtml() {
        return Promise.resolve(this.getHtml());
    }

}

export default AsyncView;