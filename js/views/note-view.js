import View from "../classes/view.js";
import notesRepository from "../storage/notes-repository.js";
import messageBus from '../classes/shared-message-bus.js';

class NoteView extends View {

    getHtml() {
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
                        aria-labelledby="toggle-completed-${this.note.id}-label"
                        id="toggle-completed-${this.note.id}"
                        class="toggle-completed"
                        data-id="${this.note.id}"
                        ${this.note.completed ? 'checked' : ''} />

                    <span class="headline-text" 
                        draggable="true"
                        id="toggle-completed-${this.note.id}-label" 
                        data-id="${this.note.id}"
                    >${this.note.title}</span>
                </div>

                <div class="controls">
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

        this.subscribeElementEvent(this.element.querySelector('.headline-text'), 'click', this.openNote.bind(this))
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

        messageBus.publish('note:updated', {
            action: 'delete',
            id: noteId,
        });
    }

    async starNote(event) {
        event.preventDefault();

        const el = event.currentTarget;
        const noteId = el.dataset.id;

        const note = await notesRepository.get(Number(noteId));

        note.starred = !note.starred;

        await notesRepository.update(Number(noteId), note);

        messageBus.publish('note:updated', {
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

        const note = await notesRepository.get(Number(noteId));

        note.completed = !!el.checked;

        await notesRepository.update(Number(noteId), note);

        messageBus.publish('note:updated', {
            action: 'update',
            id: noteId,
        });
    }

    openNote() {
        const el = event.currentTarget;
        const noteId = el.dataset.id;

        if (!noteId) {
            return;
        }

        messageBus.publish('note:opened', { id: noteId });
    }

}

export default NoteView;
