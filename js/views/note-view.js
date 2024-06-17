import View from "../classes/view.js";
import notesRepository from "../storage/notes-repository.js";
import messageBus from '../classes/shared-message-bus.js';

const MESSAGE_UPDATED_NAME = 'note:updated';

class NoteView extends View {

    getHtml() {
        const note = this.getNote();

        const lastDate = this.getReadableLastDate();

        const starBtn = !this.note.completed ? `
                <button class="star ${this.note.starred ? 'starred' : '' }"
                    data-id="${this.note.id}"
                    aria-label="${this.note.starred ? 'Unstar' : 'Star' }"
                >
                    ${this.note.starred ? '&starf;' : '&star;' }
                </button>
            ` : '';

        return `
            <li class="notes-item note">
                <div class="headline ${this.note.completed ? 'completed' : ''}">
                    <input type="checkbox"
                        id="toggle-completed-${this.note.id}"
                        class="toggle-completed"
                        data-id="${this.note.id}"
                        ${this.note.completed ? 'checked' : ''} />

                    <span id="toggle-completed-${this.note.id}" class="headline-text">${this.note.title}</span>
                </div>

                <div class="controls">
                    <span class="details">${lastDate}</span>
                    ${starBtn}
                    <button class="delete" data-id="${this.note.id}" aria-label="Delete">&#10005;</button>
                </div>
            </li>
        `;
    }

    applyEvents() {
        const deleteBtnEls = this.element.querySelectorAll('.delete');

        Array.from(deleteBtnEls).forEach(btn => {
            this.subscribeElementEvent(btn, 'click', this.deleteNote.bind(this));
        });

        const starBtnEls = this.element.querySelectorAll('.star');

        Array.from(starBtnEls).forEach(btn => {
            this.subscribeElementEvent(btn, 'click', this.starNote.bind(this));
        });

        const toggleCompletedEl = this.element.querySelectorAll('.toggle-completed');

        Array.from(toggleCompletedEl).forEach(btn => {
            this.subscribeElementEvent(btn, 'change', this.toggleCompleted.bind(this));
        });
    }

    getReadableLastDate() {
        return this.note.updatedAt ?
            new Date(this.note.updatedAt).toLocaleString() :
            new Date(this.note.createdAt).toLocaleString();
    }

    setNote(note) {
        this.note = note;
    }

    getNote() {
        return this.note;
    }

    async deleteNote(event) {
        if (!window.confirm('Delete note?')) {
            return;
        }

        event.preventDefault();

        const el = event.currentTarget;
        const noteId = el.dataset.id;

        await notesRepository.delete(Number(noteId));

        messageBus.publish(MESSAGE_UPDATED_NAME, {
            action: 'delete',
            id: noteId,
        });
    }

    async starNote(event) {
        event.preventDefault();

        const el = event.currentTarget;
        const noteId = el.dataset.id;

        const note = await this.getNote(noteId);

        note.starred = !note.starred;

        await notesRepository.update(Number(noteId), note);

        messageBus.publish(MESSAGE_UPDATED_NAME, {
            action: 'update',
            id: noteId,
        });
    }

    async toggleCompleted(event) {
        event.preventDefault();
        event.stopPropagation();

        const el = event.currentTarget;
        const noteId = el.dataset.id;

        if (!noteId) {
            return;
        }

        const note = await this.getNote(noteId);

        note.completed = !!el.checked;

        await notesRepository.update(Number(noteId), note);

        messageBus.publish(MESSAGE_UPDATED_NAME, {
            action: 'update',
            id: noteId,
        });
    }

}

export default NoteView;
