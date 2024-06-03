import sharedState from "./shared-state.js";

const SHARED_VIEW_IDX_NAME = 'view-index';

/**
 * Uses element as parent element for rendering
 */
class View {
    constructor({ element }) {
        this.element = element;
        this.uid = this.getUid();
    }

    getUid() {
        if (!this.uid) {
            this.uid = sharedState.incProp(SHARED_VIEW_IDX_NAME);
        }

        return this.uid;
    }

    render() {
        this.element.innerHTML = this.getHtml();
    }

    getHtml() {
        return `<div data-view-id="${this.getUid()}"></div>`;
    }

    destroy() {
        this.cleanup();
    }

    cleanup() {
        while(this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }
}

export default View;