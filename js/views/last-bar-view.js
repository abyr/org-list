import View from "../classes/view.js";
import messageBus from "../classes/shared-message-bus.js";
import notesRepository from "../storage/notes-repository.js";

class LastBarView extends View {

    constructor({ element}) {
        super({ element});

        messageBus.subscribe('note:opened', this.renderNoteDetails.bind(this));
    }

    getHtml() {
        if (!this.note) {
            return ``;
        }

        const note = this.note;

        return `
            <div>
                <button class="close" aria-label="Close">&#10005;</button>
            </div>
            <div class="box-v16">
                <div>${note.title}</div>
            </div>
        `;
    }

    applyEvents() {
        this.subscribeElementEvent(this.element.querySelector('.close'), 'click', this.close.bind(this));
    }

    close() {
        this.hide();
        this.cleanup();
    }

    async renderNoteDetails({ id }) {
        this.note = await notesRepository.get(id);

        this.render();
        this.show();
    }

    show() {
        this.render();
        this.element.parentNode.classList.remove('hidden');
    }

    hide() {
        this.element.parentNode.classList.add('hidden');
    }

    destroy() {
        messageBus.unsubscribe('note:opened', this.renderNoteDetails);

        super.destroy();
    }
}

export default LastBarView;