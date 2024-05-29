import AsyncView from './classes/async-view.js';
import NotesStoreAdapter from './storage-adapters/notes-adapter.js';
import ListsStoreAdapter from './storage-adapters/lists-adapter.js';

class LayoutView extends AsyncView {

    async init() {
        this.notesAdapter = new NotesStoreAdapter();
        this.listsAdapter = new ListsStoreAdapter();

        await this.notesAdapter.connect();
        await this.listsAdapter.connect();
    }

    async asyncRender() {
        const html = await this.getAsyncHtml();

        this.element.innerHTML = html;

        const addNoteEl = document.querySelector('#add-note-input');

        addNoteEl.addEventListener('keydown', this.addNote.bind(this));

        const deleteBtnEls = document.querySelectorAll('.delete-btn');

        Array.from(deleteBtnEls).forEach(btn => {
            btn.addEventListener('click', this.deleteNote.bind(this));
        });

        const toggleCompletedEl = document.querySelectorAll('.toogle-completed');

        Array.from(toggleCompletedEl).forEach(btn => {
            btn.addEventListener('change', this.toggleCompleted.bind(this));
        });
    }

    async getAsyncHtml() {
        const notes = await this.getNotes();

        return `
            <div>
                <input id="add-note-input" type="text" placeholder="Add a note..." ></input>
            </div>

            Have ${notes.length} notes.

            <ul class="notes-list"> 
                ${notes.map(x => {
                    return `
                        <li class="notes-item">
                            <div class="note ${x.completed ? 'completed' : ''}">
                                <input type="checkbox"
                                    id="toggle-completed-${x.id}"
                                    class="toogle-completed"
                                    data-id="${x.id}"
                                    ${x.completed ? 'checked' : ''} />
                                
                                <label for="toggle-completed-${x.id}">${x.title}</label>
                                
                                <button class="delete-btn" data-id="${x.id}">Delete</button>
                                
                                <span class="details">
                                    ${x.updatedAt ? 
                                        'edited ' + (new Date(x.updatedAt).toLocaleString()):
                                        'created ' + (new Date(x.createdAt).toLocaleString())
                                    }
                                </span>
                            </div>
                        </li>
                    `;
                }).join('')} 
            </ul>
        `;
    }

    async addNote(evnt) {
        if (evnt.key !== "Enter") {
            return;
        }

        evnt.preventDefault();

        const el = evnt.currentTarget;
        const text = el.value.trim();

        if (text) {
            await this.notesAdapter.put(null, {
                title: text,
            });
            await this.asyncRender();
        }
    }

    async deleteNote(evnt) {
        evnt.preventDefault();

        const el = evnt.currentTarget;
        const noteId = el.dataset.id;

        console.log('click', noteId);

        await this.notesAdapter.delete(Number(noteId));
        await this.asyncRender();
    }

    async toggleCompleted(evnt) {
        evnt.preventDefault();

        const el = evnt.currentTarget;
        const noteId = el.dataset.id;

        const note = await this.getNote(noteId);

        note.completed = !!el.checked;

        await this.notesAdapter.put(Number(noteId), note);
        await this.asyncRender();
    }

    async getNote(id) {
        return await this.notesAdapter.get(Number(id));
    }

    async getNotes() {
        return await this.notesAdapter.getAll();
    }
}

export default LayoutView;