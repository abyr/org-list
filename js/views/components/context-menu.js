const EVENT_NAME = 'contextmenu';
/**
 * Handles contextmenu event on element with handler.
 * The default action is cancel the context menu.
 *
 * Usage:
 * ```
 * new ContextMenu({
 *     element: document.querySelector('#context1'),
 *     handler: () => {}
 * })
 * ```
 */
class ContextMenu {
    constructor({ element, handler = null }) {
        this.element = element;
        this.handler = handler || this.noContext;

        this.element.addEventListener(EVENT_NAME, this.handler, false);
    }

    noContext(event) {
        event.preventDefault();
    }

    destroy() {
        this.element.removeEventListener(EVENT_NAME, this.handler, false);
    }
}

export default ContextMenu;