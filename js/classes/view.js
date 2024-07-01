import sharedState from "./shared-state.js";

const SHARED_VIEW_IDX_NAME = 'view-index';

/**
 * @param {Element} element View class uses element as parent element for rendering
 */
class View {
    constructor({ element }) {
        this.element = element;
        this.uid = this.getUid();

        this.eventSubscribersMap = {};
    }

    getUid() {
        if (!this.uid) {
            this.uid = sharedState.incProp(SHARED_VIEW_IDX_NAME);
        }

        return this.uid;
    }

    queue(selector) {
        return this.element.querySelector(selector);
    }

    queueAll(selector) {
        return this.element.querySelectorAll(selector);
    }

    render() {
        if (sharedState.getProp('debug') === true) {
            console.log('render view', this.uid, this);
        }
        this.element.innerHTML = this.getHtml();

        this.postRender();

        this.applyEvents();
    }

    postRender() {

    }

    getHtml() {
        return `<div data-view-id="${this.getUid()}"></div>`;
    }

    applyEvents() {

    }

    destroy() {
        this.cleanup();
        this.eventSubscribersMap = null;
    }

    cleanup() {
        this.unsubscribeAllEvents();

        while(this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    subscribeElementEvent(element, eventName, subscriber) {
        if (!element || !subscriber || !eventName) {
            return;
        }

        if (!this.eventSubscribersMap) {
            this.eventSubscribersMap = {};
        }

        if (!this.eventSubscribersMap[eventName]) {
            this.eventSubscribersMap[eventName] = [];
        }

        this.eventSubscribersMap[eventName].push({ element, subscriber });

        element.addEventListener(eventName, subscriber, false);
    }

    unsubscribeAllEvents() {
        if (!this.eventSubscribersMap) {
            return;
        }

        const eventNames = Object.keys(this.eventSubscribersMap);

        eventNames.forEach(eventName => {
            const eventSubscribers = this.eventSubscribersMap[eventName];

            eventSubscribers.forEach(({ element, subscriber }) => {
                element.removeEventListener(eventName, subscriber, false);
            });

            this.eventSubscribersMap[eventName] = null;
        });

        this.eventSubscribersMap = {};
    }

}

export default View;