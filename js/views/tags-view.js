import View from '../classes/view.js';
import messageBus from '../classes/shared-message-bus.js';

class TagsView extends View {

    applyEvents() {
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
                        <li class="flex-box-3 tag-item" data-id="${tag.title}">
                            # <span class="tag-btn">${tag.title}</span>
                            <span class="flex-box-3-push counter"> ${tag.count} </span>
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