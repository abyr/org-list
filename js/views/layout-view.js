import AsyncView from '../classes/async-view.js';
import NotesStoreAdapter from '../storage-adapters/notes-adapter.js';
import ListsStoreAdapter from '../storage-adapters/lists-adapter.js';
import NotesView from './notes-view.js';
import IncompleteNotesView from './incomplete-notes-view.js';
import ExportImportView from "./export-import-view.js";
import TagsView from './tags-view.js';
import messageBus from '../classes/shared-message-bus.js';

class LayoutView extends AsyncView {

    constructor({ element }) {
        super({ element });

        this.element = element;

        messageBus.subscribe('note:updated', this.refresh.bind(this));
        messageBus.subscribe('tag:selected', this.saveFilter.bind(this));
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

        const addNoteEl = document.getElementById('add-note-input');

        this.subscribeElementEvent(addNoteEl, 'keydown', this.addNote.bind(this));

        await this.renderTags();

        if (this.filter) {
            const resetFilter = document.getElementById('reset-filter-btn');

            resetFilter.addEventListener('click', this.resetFilter.bind(this));
        }

        await this.renderIncompleteNotes();
        await this.renderCompletedNotes();

        if (!this.filter) {
            this.renderExportImport();
        }
    }

    async renderTags() {
        const notes = await this.getNotes();

        const tags = notes.reduce((res, note) => {
            const newTags = note.title.split(' ').filter(word=> {
                const isTag = word.startsWith('#');

                if (!isTag) {
                    return false;
                }

                return !res.includes(word);
            });

            if (newTags) {
                res = res.concat(newTags);
            }

            return res;
        }, ['#focus']).map(x => x.substring(1));

        this.tagsView = new TagsView({
            element: document.getElementById('tags')
        });

        this.tagsView.setTags(tags);
        this.tagsView.render();
    }

    async renderIncompleteNotes() {
        const notes = await this.getNotes();

        const incompleteNotes = notes.filter(x => !x.completed)

        const sortedNotes = incompleteNotes
            .sort(sortByTimeDESC)
            .sort(sortByStarredASC)
        ;

        this.incompleteView = new IncompleteNotesView({
            element: document.getElementById('incomplete-notes')
        });
        this.incompleteView.setNotes(sortedNotes);
        this.incompleteView.render();
    }

    async renderCompletedNotes() {
        const notes = await this.getNotes();
        const completedNotes = notes.filter(x => x.completed).sort(sortByTimeDESC);

        this.completedView = new NotesView({
            element: document.getElementById('completed-notes')
        });
        this.completedView.setNotes(completedNotes);
        this.completedView.render();
    }

    renderExportImport() {
        this.expImpView = new ExportImportView({
            element: document.getElementById('export-import')
        });
        this.expImpView.render();
    }

    async getAsyncHtml() {
        const notes = await this.getNotes();

        return `
            <div class="box add-note-box">
                <input id="add-note-input" class="add-note-input" type="text" placeholder="Add a note..." />
            </div>
            
            ${this.filter ? `
                <button id="reset-filter-btn"> < </button>
            ` : ''}
            
            <div id="tags"></div>

            <div id="incomplete-notes"></div>
            <div id="completed-notes"></div>
            
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

    async refresh() {
        await this.asyncRender();
    }

    async resetFilter() {
        await this.saveFilter(null);
    }

    async saveFilter(filter) {
        this.filter = filter;

        await this.refresh(filter);
    }

    async getNotes() {
        const allNotes = await this.notesAdapter.getAll();

        if (!this.filter) {
            return allNotes;
        }

        let filtered = [];

        if (this.filter.tag) {
            filtered = allNotes.filter(x => x.title.indexOf('#' + this.filter.tag) > -1);
        }

        return filtered;
    }

    cleanup() {
        super.cleanup();

        if (this.expImpView) {
            this.expImpView.destroy();
            this.expImpView = null;
        }
        if (this.completedView) {
            this.completedView.destroy();
            this.completedView = null;
        }
        if (this.incompleteView) {
            this.incompleteView.destroy();
            this.incompleteView = null;
        }
        if (this.tagsView) {
            this.tagsView.destroy();
            this.tagsView = null;
        }
    }

    destroy() {
        messageBus.unsubscribe('note:updated', this.refresh);
        messageBus.unsubscribe('tag:selected', this.saveFilter);

        this.expImpView = null;
        this.completedView = null;
        this.incompleteView = null;
        this.tagsView = null;

        super.destroy();
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
