import View from '../classes/view.js';
import messageBus from '../classes/shared-message-bus.js';

class TagsView extends View {

    render() {
        super.render();

        const tagsEl = this.element.querySelectorAll('.tag-btn');

        tagsEl.forEach(el => {
            this.subscribeElementEvent(el, 'click', this.filterTag.bind(this));
        });
    }

    getHtml() {
        const tags = this.getTags();

        return `
            <ul class="tags-box list">
                ${tags.map(tag => {
                    return `
                        <li class="tags-item tag">
                            <button class="tag-btn" data-tag="${tag}">${tag}</button>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    filterTag(event) {
        const el = event.currentTarget;
        const tag = el.innerText;

        messageBus.publish('tag:selected', { tag });
    }

    setTags(tags) {
        this.tags = tags;
    }

    getTags() {
        return this.tags;
    }

    destroy() {
        this.tags = null;
        super.destroy();
    }
}

export default TagsView;