import AsyncView from '../classes/async-view.js';
import NotesView from './notes-view.js';
import IncompleteNotesView from './incomplete-notes-view.js';
import ExportImportView from "./export-import-view.js";
import ListsView from "./lists-view.js";
import messageBus from '../classes/shared-message-bus.js';
import Collapsible from './components/collapsible.js';
import notesRepository from '../storage/notes-repository.js';
import ContextMenu from "./components/context-menu.js";
import LastBarView from "./last-bar-view.js";
import listsRepository from "../storage/lists-repository.js";

class LayoutView extends AsyncView {

    constructor({ element }) {
        super({ element });

        this.element = element;

        messageBus.subscribe('note:updated', this.refresh.bind(this));
        messageBus.subscribe('tag:selected', this.saveFilter.bind(this));
    }

    async asyncRender() {
        this.cleanup();

        this.element.innerHTML = await this.getAsyncHtml();

        await this.renderLastBar();
        await this.renderLists();
        await this.renderIncompleteNotes();
        await this.renderCompletedNotes();

        if (!this.filter) {
            this.renderExportImport();
        }

        const collapsibleList = document.querySelectorAll('.collapsible-header');

        if (collapsibleList) {
            collapsibleList.forEach(el => new Collapsible(el));
        }

        if (this.filter) {
            const resetFilter = document.getElementById('reset-filter-btn');

            this.subscribeElementEvent(resetFilter, 'click', this.resetFilter.bind(this));
        }

        const addNoteEl = document.getElementById('add-note-input');

        this.subscribeElementEvent(addNoteEl, 'keydown', this.addNote.bind(this));

        new ContextMenu({ element: document.querySelector('.side-bar-header') });
    }

    async renderLastBar() {
        const lastBarEl = this.element.querySelector('.last-bar');

        const lastBarView = new LastBarView({ element: lastBarEl });

        lastBarView.render();

        this.lastBarView = lastBarView;
    }

    async renderLists() {
        const listsEl = document.getElementById('lists');

        this.listsView = new ListsView({
            element: listsEl
        });
        await this.listsView.asyncRender();

        const dropEls = listsEl.querySelectorAll('li');

        dropEls.forEach(el => {
            this.subscribeElementEvent(el, 'dragover', this.dragOver.bind(this));
            this.subscribeElementEvent(el, 'drop', this.dragDrop.bind(this));
        });
    }

    async renderIncompleteNotes() {
        const notes = await this.getNotes();

        const incompleteNotes = notes.filter(x => !x.completed)

        const sortedNotes = incompleteNotes
            .sort(sortByTimeDESC)
            .sort(sortByStarredASC)
        ;

        const incompleteEl = document.getElementById('incomplete-notes');

        this.incompleteView = new IncompleteNotesView({
            element: incompleteEl
        });
        this.incompleteView.setNotes(sortedNotes);
        this.incompleteView.render();

        const draggableEls = incompleteEl.querySelectorAll('[draggable="true"]');

        draggableEls.forEach(el => {
            this.subscribeElementEvent(el, 'dragstart', this.dragStart.bind(this));
            this.subscribeElementEvent(el, 'dragend', this.dragEnd.bind(this));
        });
    }

    dragStart(event) {
        const el = event.currentTarget;

        this.dragNoteId = +el.dataset.id;

        setTimeout(() => {
            el.classList.add('blurred');
        }, 0);
    }

    dragEnd(event) {
        const el = event.currentTarget;
        
        setTimeout(() => {
            el.classList.remove('blurred');
        }, 0);
    }
    

    dragOver(event) {
        event.preventDefault();
    }

    async dragDrop(event) {
        const el = event.currentTarget;

        this.dragToListId = +el.dataset.id;

        const lists = await listsRepository.getAll();

        const list = await listsRepository.get(this.dragToListId);

        for (const x of lists) {
            const index = x.notes && x.notes.indexOf(this.dragNoteId);

            if (index > -1) {
                x.notes.splice(index, 1);
                await listsRepository.update(x.id, x);
            }
        }

        if (list.notes) {
            if (list.notes.includes(this.dragNoteId)) {
                return
            }

            list.notes.push(this.dragNoteId);
        } else {
            list.notes = [this.dragNoteId];
        }

        await listsRepository.update(this.dragToListId, list);

        this.dragNoteId = null;
        this.dragToListId = null;

        await this.refresh();
    }

    async renderCompletedNotes() {
        const notes = await this.getCompletedNotes();
        const completedNotes = notes.sort(sortByTimeDESC);

        if (!completedNotes.length) {
            return;
        }

        this.completedView = new NotesView({
            element: document.getElementById('completed-notes')
        });
        this.completedView.setNotes(completedNotes);
        this.completedView.render();
    }

    async getCompletedNotes() {
        const notes = await this.getNotes();

        return notes.filter(x => x.completed);
    }

    renderExportImport() {
        this.expImpView = new ExportImportView({
            element: document.getElementById('export-import')
        });
        this.expImpView.render();
    }

    async getAsyncHtml() {
        const completedNotes = await this.getCompletedNotes();

        return `

            <div class="flex-box-3">
                <div class="flex-box-3-col-1">

                    <div class="side-bar box-16">
                        <div class="side-bar-header">
                            Orglist
                        </div>
                        <div class="side-bar-content">
                            <div id="lists"></div>
                        </div>
                    </div>

                </div>
                <div class="flex-box-3-col-2">
                    <div class="middle-bar box-16">

                        <div id="notes">
                            <div class="add-note-box">
                                <input id="add-note-input" 
                                       class="add-note-input" 
                                       type="text" 
                                       placeholder="Add a note..." />
                            </div>

                            ${this.filter ? `
                                <button id="reset-filter-btn"> < </button>
                            ` : ''}
                            <div id="incomplete-notes"></div>

                            ${completedNotes.length ? `
                                <div class="collapsible">
                                    <div class="collapsible-header">
                                        <button type="button"
                                            aria-expanded="true"
                                            class="collapsible-trigger"
                                            aria-controls="completed-notes-section-toggle"
                                            id="completed-notes-section"
                                        >
                                            <span class="collapsible-title">
                                                Completed notes
                                                <span class="collapsible-icon"></span>
                                            </span>
                                        </button>
                                    </div>
                                    <div id="completed-notes-section-toggle"
                                         role="region"
                                         aria-labelledby="completed-notes-section"
                                         class="collapsible-content">
    
                                         <div id="completed-notes"></div>
                                    </div>
                                </div>
                            ` : ''}

                        </div>

                    </div>
                </div>
                <div class="flex-box-3-col-3 hidden">
                    <div class="last-bar box-16">

                    </div>
                </div>
            </div>

            <div class="box-16">
                <div id="export-import"></div>
            </div>
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
            await notesRepository.create({
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
        return await notesRepository.search({
            text: this.filter ?
                '#' + this.filter.tag :
                ''
        });
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
    }

    destroy() {
        messageBus.unsubscribe('note:updated', this.refresh);
        messageBus.unsubscribe('tag:selected', this.saveFilter);

        this.expImpView = null;
        this.completedView = null;
        this.incompleteView = null;
        this.tagsView = null;
        this.lastBarView = null;

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
