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
    }

    async getAsyncHtml() {
        const notes = await this.getNotes();

        const notesHtml = notes.map(x => {
            return `
                <div class="note" data-id="${x.id}">
                    <b>${x.title}</b> created at ${new Date(x.createdAt).toLocaleString()}
                </div>
            `;
        }).join('');

        const addNotesHtml = `
            <div>
                <input id="add-note-input" type="text" placeholder="Add a note..." ></input>
            </div>
        `;

        return `
            ${addNotesHtml}

            Have ${notes.length} notes.

            ${notesHtml}
        `;
    }

    async getNotes() {
        return await this.notesAdapter.getAll();
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
        }
    }
}

export default LayoutView;