import View from '../classes/view.js';
import NotesStoreAdapter from '../storage-adapters/notes-adapter.js';
import messageBus from '../classes/shared-message-bus.js';

const MESSAGE_UPDATED_NAME = 'note:updated';

class NotesView extends View {

    constructor({ element }) {
        super({ element });

        this.notesAdapter = null;
    }

    async initAdapters() {
        this.notesAdapter = new NotesStoreAdapter();

        await this.notesAdapter.connect();
    }

    render() {
        super.render();

        const deleteBtnEls = this.element.querySelectorAll('.delete');

        Array.from(deleteBtnEls).forEach(btn => {
            btn.addEventListener('click', this.deleteNote.bind(this));
        });

        const starBtnEls = this.element.querySelectorAll('.star');

        Array.from(starBtnEls).forEach(btn => {
            btn.addEventListener('click', this.starNote.bind(this));
        });

        const toggleCompletedEl = this.element.querySelectorAll('.toggle-completed');

        Array.from(toggleCompletedEl).forEach(btn => {
            btn.addEventListener('change', this.toggleCompleted.bind(this));
        });
    }

    getHtml() {
        const notes = this.getNotes();

        if (!notes.length) {
            return ``;
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

    async deleteNote(event) {
        if (!window.confirm('Delete note?')) {
            return;
        }

        event.preventDefault();

        const el = event.currentTarget;
        const noteId = el.dataset.id;

        if (!this.notesAdapter) {
            await this.initAdapters();
        }

        await this.notesAdapter.delete(Number(noteId));

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

        await this.notesAdapter.put(Number(noteId), note);

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

        await this.notesAdapter.put(Number(noteId), note);

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
        if (!this.notesAdapter) {
            await this.initAdapters();
        }

        return await this.notesAdapter.get(Number(id));
    }

}

export default NotesView;