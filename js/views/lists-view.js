import AsyncView from "../classes/async-view.js";
import TagsView from './tags-view.js';
import notesRepository from '../storage/notes-repository.js';
import listsRepository from '../storage/lists-repository.js';
import messageBus from "../classes/shared-message-bus.js";

import staticLists from '../storage/static-lists.js';

class ListsView extends AsyncView {

    constructor({ element }) {
        super({ element });

        this.element = element;

        messageBus.subscribe('tag:selected', this.saveFilter.bind(this));
    }

    async asyncRender() {
        this.cleanup();

        this.element.innerHTML = await this.getAsyncHtml();

        await this.renderTags();

        const addNoteEl = document.getElementById('add-list-input');

        this.subscribeElementEvent(addNoteEl, 'keydown', this.addList.bind(this));

        const listItems = this.element.querySelectorAll('.list-item');

        listItems.forEach(x => {
            this.subscribeElementEvent(x, 'click', this.selectList.bind(this));
        });
    }

    async selectList(event) {
        messageBus.publish('list:selected', { id: event.currentTarget.dataset.id });
    }

    async getAsyncHtml() {
        const lists = await this.getLists();
        const allNotes = await notesRepository.getAll();
        const incompleteNotes = allNotes.filter(x => !x.completed);

        const listedNotesIds = lists.reduce((ids, list) => ids.concat(list.notes || []), []);

        staticLists.forEach(x => {
            if (x.id === 'inbox') {
                x.notes = incompleteNotes.reduce((res, note) => {
                    if (!listedNotesIds.includes(+note.id)) {
                        res.push(note.id);
                    }

                    return res;
                }, []);

            } else if (x.id === 'starred') {
                x.notes = incompleteNotes.filter(x => x.starred && !x.completed);
            }
        });

        return `
            <ul class="box-top16">
                ${staticLists.map(list => {
                    return `
                        <li class="flex-box-3 list-item" data-id="${list.id}">
                            <span class="list-btn">${list.icon} ${list.title}</span>
                            <span class="flex-box-3-push counter">
                                ${list.notes && list.notes.length ? list.notes.length : ''}
                            </span>
                        </li>
                    `;
                }).join('')}
            </ul>
            
            <ul>
                ${lists.map(list => {
                    return `
                        <li class="flex-box-3 list-item" data-id="${list.id}">
                            <span class="list-btn">&#9776; ${list.title}</span>
                            <span class="flex-box-3-push counter">
                                ${list.notes && list.notes.length ? list.notes.length : ''}
                            </span>
                        </li>
                    `;
                }).join('')}
            </ul>
            
            <div id="tags" class="box box-v16"></div>
            
            <div class="add-list-box box-top16">
                <input id="add-list-input" class="add-list-input" type="text" placeholder="+ Add a list..." />
            </div>
        `;
    }

    async renderTags() {
        const notes = await this.getNotes();
        const tagsLenMap = {};

        const tags = notes.reduce((res, note) => {
            const newTags = note.title.split(' ').filter(word => {
                const isTag = word.startsWith('#');

                if (word === '#focus' && !note.completed) {
                    incObjProp(tagsLenMap, word);
                }

                if (!isTag) {
                    return false;
                }

                return !res.includes(word);
            });

            if (!note.completed) {
                newTags.forEach(tag => {
                    incObjProp(tagsLenMap, tag);
                });
            }

            if (newTags) {
                res = res.concat(newTags);
            }

            return res;
        }, ['#focus']).map(tag => {
            return {
                title: tag.substring(1),
                count: tagsLenMap[tag] || 0,
            };
        });

        this.tagsView = new TagsView({
            element: document.getElementById('tags')
        });

        this.tagsView.setTags(tags);
        this.tagsView.render();
    }

    async addList(event) {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();

        const el = event.currentTarget;
        const text = el.value.trim();

        if (text) {
            await listsRepository.create({
                title: text,
                notes: [],
            });
            await this.asyncRender();
        }
    }

    async getLists() {
        return await listsRepository.getAll();
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

    async saveFilter(filter) {
        this.filter = filter;
    }

}

function incObjProp (obj, key) {
    if (typeof obj[key] === 'undefined') {
        obj[key] = 0;
    }
    obj[key] += 1;
}

export default ListsView;