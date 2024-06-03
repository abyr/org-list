import AsyncView from '../classes/async-view.js';
import NotesStoreAdapter from '../storage-adapters/notes-adapter.js';
import ListsStoreAdapter from '../storage-adapters/lists-adapter.js';
import ExportImportView from "./export-import-view.js";

class LayoutView extends AsyncView {

    constructor({ element }) {
        super({ element });

        this.element = element;
    }

    async init() {
        this.notesAdapter = new NotesStoreAdapter();
        this.listsAdapter = new ListsStoreAdapter();

        await this.notesAdapter.connect();
        await this.listsAdapter.connect();
    }

    async asyncRender() {
        this.cleanup();

        this.element.innerHTML = await this.getAsyncHtml();

        this.renderExportImport();

        const addNoteEl = document.querySelector('#add-note-input');

        addNoteEl.addEventListener('keydown', this.addNote.bind(this));

        const deleteBtnEls = document.querySelectorAll('.delete');

        Array.from(deleteBtnEls).forEach(btn => {
            btn.addEventListener('click', this.deleteNote.bind(this));
        });

        const starBtnEls = document.querySelectorAll('.star');

        Array.from(starBtnEls).forEach(btn => {
            btn.addEventListener('click', this.starNote.bind(this));
        });

        const toggleCompletedEl = document.querySelectorAll('.toggle-completed');

        Array.from(toggleCompletedEl).forEach(btn => {
            btn.addEventListener('change', this.toggleCompleted.bind(this));
        });
    }

    renderExportImport() {
        this.expImp = new ExportImportView({
            element: document.getElementById('export-import')
        });
        this.expImp.render();
    }

    async getAsyncHtml() {
        const notes = await this.getNotes();

        const incompleteNotes = notes.filter(x => !x.completed)
            .sort(sortByTimeDESC)
            .sort(sortByStarredASC)
            ;
            
        const completedNotes = notes.filter(x => x.completed).sort(sortByTimeDESC);

        return `
            <div class="box add-note-box">
                <input id="add-note-input" class="add-note-input" type="text" placeholder="Add a note..." />
            </div>

            <ul class="box notes-list-box"> 
                ${incompleteNotes.map(x => {
                    return `
                        <li class="notes-item note">
                            <div class="headline ${x.completed ? 'completed' : ''}">
                                <input type="checkbox"
                                    id="toggle-completed-${x.id}"
                                    class="toggle-completed"
                                    data-id="${x.id}"
                                    ${x.completed ? 'checked' : ''} />
                                
                                <label for="toggle-completed-${x.id}">${x.title}</label>
                            </div>
                            <div class="controls">
                                <span class="details">
                                    ${x.updatedAt ? 
                                        new Date(x.updatedAt).toLocaleString() :
                                        new Date(x.createdAt).toLocaleString()
                                    }
                                </span>
                                
                                <button class="star ${x.starred ? 'starred' : '' }" 
                                    data-id="${x.id}" 
                                    aria-label="${x.starred ? 'Unstar' : 'Star' }"
                                >
                                    ${x.starred ? '&starf;' : '&star;' }
                                </button>
                                
                                <button class="delete" data-id="${x.id}" aria-label="Delete">&#10005;</button>
                            </div>
                        </li>
                    `;
                }).join('')} 
            </ul>

            <ul class="notes-list-box"> 
                ${completedNotes.map(x => {
                    return `
                        <li class="notes-item note">
                            <div class="headline ${x.completed ? 'completed' : ''}">
                                <input type="checkbox"
                                    id="toggle-completed-${x.id}"
                                    class="toggle-completed"
                                    data-id="${x.id}"
                                    ${x.completed ? 'checked' : ''} />
                                
                                <label for="toggle-completed-${x.id}">${x.title}</label>
                                
                                
                            </div>
                            <div class="controls">          
                                <span class="details">
                                    ${x.updatedAt ? 
                                        new Date(x.updatedAt).toLocaleString() :
                                        new Date(x.createdAt).toLocaleString()
                                    }
                                </span>              
                                <button class="delete-btn" data-id="${x.id}" aria-label="Delete">&#10005;</button>
                            </div>
                        </li>
                    `;
                }).join('')} 
            </ul>

            <div id="export-import" class="box"></div>
        `;
    }

    async addNote(event) {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();

        const el = event.currentTarget;
        const text = el.value.trim();

        if (text) {
            await this.notesAdapter.put(null, {
                title: text,
            });
            await this.asyncRender();
        }
    }

    async deleteNote(event) {
        if (!window.confirm('Delete note?')) {
            return;
        }

        event.preventDefault();

        const el = event.currentTarget;
        const noteId = el.dataset.id;

        await this.notesAdapter.delete(Number(noteId));
        await this.asyncRender();
    }

    async starNote(event) {
        event.preventDefault();

        const el = event.currentTarget;
        const noteId = el.dataset.id;

        const note = await this.getNote(noteId);

        note.starred = !note.starred;

        await this.notesAdapter.put(Number(noteId), note);
        await this.asyncRender();
    }

    async toggleCompleted(event) {
        event.preventDefault();

        const el = event.currentTarget;
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

    cleanup() {
        if (this.expImp) {
            this.expImp.destroy();
            this.expImp = null;
        }
        super.cleanup();
    }

    destroy() {
        super.destroy();
        this.expImp = null;
    }
}

function sortByTimeDESC (a, b) {
    const aTime = a.updatedAt || a.createdAt;
    const bTime = b.updatedAt || b.createdAt;
    
    return bTime - aTime;
}

function sortByStarredASC (a, b) {
    return (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
}

export default LayoutView;
