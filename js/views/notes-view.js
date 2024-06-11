import View from '../classes/view.js';
import notesRepository from "../storage/notes-repository.js";
import messageBus from '../classes/shared-message-bus.js';

const MESSAGE_UPDATED_NAME = 'note:updated';

class NotesView extends View {

    render() {
        super.render();

        const notes = this.getNotes();

        if (!notes.length) {
            return;
        }

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

    getHtml() {
        const notes = this.getNotes();

        if (!notes.length) {
            return this.getEmptyHtml();
        }

        return `
            <ul class="notes-list-box"> 
                ${notes.map(x => {
                    
                    const lastDate = x.updatedAt ?
                        new Date(x.updatedAt).toLocaleString() :
                        new Date(x.createdAt).toLocaleString();
                    
                    const starBtn = !x.completed ? `
                        <button class="star ${x.starred ? 'starred' : '' }" 
                            data-id="${x.id}" 
                            aria-label="${x.starred ? 'Unstar' : 'Star' }"
                        >
                            ${x.starred ? '&starf;' : '&star;' }
                        </button>
                    ` : '';
                    
                    return `
                        <li class="notes-item note">
                            <div class="headline ${x.completed ? 'completed' : ''}">
                                <input type="checkbox"
                                    id="toggle-completed-${x.id}"
                                    class="toggle-completed"
                                    data-id="${x.id}"
                                    ${x.completed ? 'checked' : ''} />
                                
                                <span id="toggle-completed-${x.id}">${x.title}</span>
                            </div>
                            
                            <div class="controls">   
                                <span class="details">${lastDate}</span>
                                ${starBtn}
                                <button class="delete" data-id="${x.id}" aria-label="Delete">&#10005;</button>
                            </div>
                        </li>
                    `;
                }).join('')} 
            </ul>
        `;
    }

    getEmptyHtml() {
        return ``;
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

    setNotes(notes) {
        this.notes = notes;
    }

    getNotes() {
        return this.notes;
    }

    async getNote(id) {
        return await notesRepository.get(Number(id));
    }

    cleanup() {
        const deleteBtnEls = this.element.querySelectorAll('.delete');

        Array.from(deleteBtnEls).forEach(btn => {
            btn.removeEventListener('click', this.deleteNote);
        });

        const starBtnEls = this.element.querySelectorAll('.star');

        Array.from(starBtnEls).forEach(btn => {
            btn.removeEventListener('click', this.starNote);
        });

        const toggleCompletedEl = this.element.querySelectorAll('.toggle-completed');

        Array.from(toggleCompletedEl).forEach(btn => {
            btn.removeEventListener('change', this.toggleCompleted);
        });

        super.cleanup();
    }

    destroy() {
        this.notes = null;
        super.destroy();
    }
}

export default NotesView;