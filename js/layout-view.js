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

        const incompletedNotes = notes.filter(x => !x.completed).sort(sortByTimeDESC);
        const completedNotes = notes.filter(x => x.completed).sort(sortByTimeDESC);

        return `
            <div>
                <input id="add-note-input" type="text" placeholder="Add a note..." ></input>
            </div>

            Have ${incompletedNotes.length} notes.

            <ul class="notes-list"> 
                ${incompletedNotes.map(x => {
                    return `
                        <li class="notes-item note">
                            <div class="headline ${x.completed ? 'completed' : ''}">
                                <input type="checkbox"
                                    id="toggle-completed-${x.id}"
                                    class="toogle-completed"
                                    data-id="${x.id}"
                                    ${x.completed ? 'checked' : ''} />
                                
                                <label for="toggle-completed-${x.id}">${x.title}</label>
                            </div>
                            <div class="controls">
                                <button class="delete-btn" data-id="${x.id}" aria-label="Delete">&#10005;</button>
                            </div>
                        </li>
                    `;
                }).join('')} 
            </ul>

            <ul class="notes-list"> 
                ${completedNotes.map(x => {
                    return `
                        <li class="notes-item note">
                            <div class="headline ${x.completed ? 'completed' : ''}">
                                <input type="checkbox"
                                    id="toggle-completed-${x.id}"
                                    class="toogle-completed"
                                    data-id="${x.id}"
                                    ${x.completed ? 'checked' : ''} />
                                
                                <label for="toggle-completed-${x.id}">${x.title}</label>
                                
                                <span class="details">
                                    ${x.updatedAt ? 
                                        'edited ' + (new Date(x.updatedAt).toLocaleString()):
                                        'created ' + (new Date(x.createdAt).toLocaleString())
                                    }
                                </span>
                            </div>
                            <div class="controls">                                
                                <button class="delete-btn" data-id="${x.id}" aria-label="Delete">&#10005;</button>
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

function sortByTimeDESC (a, b) {
    const aTime = a.updatedAt || a.createdAt;
    const bTime = b.updatedAt || b.createdAt;
    
    return bTime - aTime;
}

export default LayoutView;
