import View from '../classes/view.js';
import notesRepository from '../storage/notes-repository.js';
import messageBus from '../classes/shared-message-bus.js';

class NoteDetailsView extends View {

    getHtml() {
        const note = this.note;

        return `
            <div id="note-title-${note.id}"
                role="textbox"
                contenteditable="true"
                aria-placeholder="title"
                aria-labelledby="noteTitleLabel">${note.title}</div>
        `
    }

    applyEvents() {
        const titleEl = this.element.querySelector('#note-title-' + this.note.id);

        this.subscribeElementEvent(titleEl, 'blur', this.applyTitle.bind(this));
    }

    async applyTitle(event) {
        const newTitle = event.currentTarget.innerText.trim();

        if (this.note.title === newTitle) {
            return;
        }
        this.note.title = newTitle.trim();

        await notesRepository.update(Number(this.note.id), this.note);

        messageBus.publish('note:updated', {
            action: 'update',
            id: this.note.id,
        });
    }

    setNote(note) {
        this.note = note;
    }
}

export default NoteDetailsView;