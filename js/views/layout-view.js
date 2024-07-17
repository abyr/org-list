import AsyncView from '../classes/async-view.js';
import ContextMenu from "./components/context-menu.js";
import MiddleBarHeader from "./middle-bar-header.js";
import LastBarView from "./last-bar-view.js";
import NotesView from './notes-view.js';
import IncompleteNotesView from './incomplete-notes-view.js';
import ExportImportView from "./export-import-view.js";
import ListsView from "./lists-view.js";
import Collapsible from './components/collapsible.js';
import staticLists from '../storage/static-lists.js';

import messageBus from '../classes/shared-message-bus.js';
import notesRepository from '../storage/notes-repository.js';
import listsRepository from "../storage/lists-repository.js";


class LayoutView extends AsyncView {

    constructor({ element }) {
        super({ element });

        this.element = element;

        messageBus.subscribe('note:updated', this.refresh.bind(this));
        messageBus.subscribe('tag:selected', this.saveFilter.bind(this));
        messageBus.subscribe('list:selected', this.showList.bind(this));
    }

    async asyncRender() {
        this.cleanup();

        this.element.innerHTML = await this.getAsyncHtml();

        this.renderBatchControls();
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

        if (this.filter || this.list || this.staticList) {
            const resetFilter = document.getElementById('reset-filter-btn');

            this.subscribeElementEvent(resetFilter, 'click', this.resetFilter.bind(this));
        }

        const addNoteEl = document.getElementById('add-note-input');

        this.subscribeElementEvent(addNoteEl, 'keydown', this.addNote.bind(this));

        new ContextMenu({ element: document.querySelector('.side-bar-header') });

        this.postRender();
    }

    postRender() {
        super.postRender();

        const editableList = this.queueAll('[contenteditable="true"]');

        editableList.forEach(el => {
            this.subscribeElementEvent(el, 'keydown', this.saveOnEnter.bind(this));
        });


        const deleteList = this.queueAll('.delete-list');

        deleteList.forEach(el => {
            this.subscribeElementEvent(el, 'click', this.deleteList.bind(this));
        });

    }

    renderBatchControls() {
        const middleHeaderEl = this.queue('.middle-bar-header');

        const middleHeaderView = new MiddleBarHeader({ element: middleHeaderEl });

        middleHeaderView.render();

        this.middleHeaderView = middleHeaderView;
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

        if (!el.classList.contains('list-item')) {
            return;
        }

        const targetId = +el.dataset.id;

        if (!targetId) {
            return;
        }

        this.dragToListId = targetId;

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

                        <div class="middle-bar-header"></div>
                        
                        <div class="middle-bar-content box-top16">
    
                            <div id="notes">
                                <div class="add-note-box">
                                    <input id="add-note-input" 
                                           class="add-note-input" 
                                           type="text" 
                                           placeholder="+ Add a note..." />
                                </div>
    
                                ${(this.filter || this.list || this.staticList) ? `
                                    <div class="flex-box-3 box-v16">
                                        <button id="reset-filter-btn"> < </button>
                                        
                                        ${this.filter && this.filter.tag ? `
                                            <span># ${this.filter.tag}</span>              
                                        ` : '' }
                                        ${this.list ? `
                                            <span class="list-title" 
                                                data-id="${this.list.id}" 
                                                data-type="list"
                                                contenteditable="true"
                                            >${this.list.title}</span>
                                            
                                            <button class="flex-box-3-push delete-list" 
                                                data-id="${this.list.id}"
                                                class="flex-box-3-push"
                                            >x Delete</button>
                                        ` : '' }
                                        
                                        ${this.staticList ? `
                                            <span class="list-title" 
                                                data-id="${this.staticList.id}" 
                                            >${this.staticList.title}</span>
                                        ` : '' }
                                    </div>
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

    async saveFilter(filter) {
        this.notes = null;
        this.list = null;
        this.staticList = null;

        this.filter = filter;

        await this.refresh();
    }

    async showList({ id }){
        this.filter = null;
        this.staticList = null;

        if (id === 'inbox') {
            await this.showInbox();
            return;

        } else if (id === 'starred') {
            await this.showStarred();
            return;
        }

        const list = await listsRepository.get(id);
        const notesIds = list.notes;

        const allNotes = await notesRepository.getAll();

        const notes = allNotes.reduce((res, note) => {
            if (notesIds.includes(+note.id)) {
                res.push(note);
            }

            return res;
        }, []);

        this.list = list;
        this.notes = notes;

        await this.refresh();

        list.notes = notes.map(x => x.id);

        await listsRepository.update(this.list.id, list);
    }

    async showInbox() {
        this.list = null;
        this.staticList = staticLists.find(x => x.id === 'inbox');

        const allLists = await listsRepository.getAll();
        const allNotes = await notesRepository.getAll();

        const listedNotesIds = allLists.reduce((ids, list) => ids.concat(list.notes || []), []);

        this.notes = allNotes.reduce((res, note) => {
            if (!listedNotesIds.includes(+note.id)) {
                res.push(note);
            }

            return res;
        }, []);

        await this.refresh();
    }

    async showStarred() {
        this.list = null;

        this.staticList = this.staticList = staticLists.find(x => x.id === 'starred');

        const allNotes = await notesRepository.getAll();

        this.notes = allNotes.filter(x => x.starred && !x.completed);

        await this.refresh();
    }

    async getNotes() {
        if (this.notes) {
            return this.notes;
        }
        return await notesRepository.search({
            text: this.filter ?
                '#' + this.filter.tag :
                ''
        });
    }

    async saveOnEnter() {
        if (event.code === 'Enter') {
            event.preventDefault();

            const $target = event.currentTarget;

            const id = Number($target.dataset.id);

            const originList = await listsRepository.get(id);

            const newTitle = $target.innerText.trim();

            await listsRepository.update(id, Object.assign({}, originList, {
                title: newTitle,
            }));

            messageBus.publish('list:updated', {
                action: 'update',
                id: id,
            });

            this.refresh();
        }
    }

    async deleteList() {
        const target = event.currentTarget;

        const id = Number(target.dataset.id);

        await listsRepository.delete(id);

        await this.resetFilter();
    }

    async refresh() {
        await this.asyncRender();
    }

    async resetFilter() {
        await this.saveFilter(null);
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
        if (this.middleHeaderView) {
            this.middleHeaderView.destroy();
            this.middleHeaderView = null;
        }
        if (this.lastBarView) {
            this.lastBarView.destroy();
            this.lastBarView = null;
        }
    }

    destroy() {
        messageBus.unsubscribe('note:updated', this.refresh);
        messageBus.unsubscribe('tag:selected', this.saveFilter);
        messageBus.unsubscribe('list:selected', this.showList);

        this.expImpView = null;
        this.completedView = null;
        this.incompleteView = null;
        this.tagsView = null;
        this.middleHeaderView = null;
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
