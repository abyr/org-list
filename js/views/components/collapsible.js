/**
 * Class for collapsible elements
 *
 * @class Collapsible
 *
 * Usage:
 *
 * ```js
 * import Collapsible from 'collapsible.js';
 *
 * const collapsibleList = document.querySelectorAll('.collapsible-header');
 *
 * collapsibleList.forEach(el => new Collapsible(el, {}));
 * ```
 *
 * ```html
 * <div class="collapsible">
 *     <div class="collapsible-header">
 *         <button type="button"
 *                 aria-expanded="true"
 *                 class="collapsible-trigger"
 *                 aria-controls="section-toggle"
 *                 id="section">
 *             <span class="collapsible-title">
 *                 Collapsible title
 *                 <span class="collapsible-icon"></span>
 *             </span>
 *         </button>
 *     </div>
 *     <div id="section-toggle"
 *          aria-labelledby="section"
 *          role="region"
 *          class="collapsible-content">
 *         Collapsible content
 *     </div>
 * </div>
 * ```
 */
class Collapsible {

    /**
     * 
     * @param {Element} element 
     * @param {Object} settings 
     * @param {function} [settings.onToggle]
     * @returns 
     */
    constructor(element, settings = {}) {
        this.element = element;

        if (settings.onToggle) {
            this.onToggle = settings.onToggle;
        }

        this.buttonEl = this.element.querySelector('button[aria-expanded]');

        const triggers = this.buttonEl.getAttribute('aria-controls');

        if (!triggers) {
            return;
        }

        this.contentEl = document.getElementById(triggers);
        this.toggle(this.buttonEl.getAttribute('aria-expanded') === 'true');

        this.buttonEl.addEventListener('click', this.toggleHandler.bind(this));
    }

    toggleHandler() {
        this.toggle(!this.isExpanded);
    }

    toggle(isExpanded) {
        if (isExpanded === this.isExpanded) {
            return;
        }

        this.isExpanded = isExpanded;

        this.buttonEl.setAttribute('aria-expanded', `${isExpanded}`);

        if (isExpanded) {
            this.contentEl.removeAttribute('hidden');
        } else {
            this.contentEl.setAttribute('hidden', '');
        }

        this.onToggle(isExpanded);
    }

}

export default Collapsible;
