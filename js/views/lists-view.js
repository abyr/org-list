import AsyncView from "../classes/async-view.js";
import TagsView from './tags-view.js';
import notesRepository from '../storage/notes-repository.js';
import listsRepository from '../storage/lists-repository.js';
import messageBus from "../classes/shared-message-bus.js";

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
    }

    async getAsyncHtml() {
        const staticLists = [{
            title: '&#10061; All'
        }, {
            title: '&star; Starred'
        }];

        const lists = await this.getLists();

        return `
            <h2>Lists</h2>
            
            <ul>
                ${staticLists.map(list => {
                    return `
                        <li>${list.title}</li>
                    `;
                }).join('')}
            </ul>
            
            <ul>
                ${lists.map(list => {
                    return `
                        <li>&#9776; ${list.title}</li>
                    `;
                }).join('')}
            </ul>
            
            <div class="add-list-box box-v16">
                <input id="add-list-input" class="add-list-input" type="text" placeholder="Add a list..." />
            </div>
            
            <h2>Tags</h2>
            
            <div id="tags" class="box"></div>
            
        `;
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
            });
            await this.asyncRender();
        }
    }

    async getLists() {
        return await listsRepository.getAll();
    }

    async getNotes() {
        const allNotes = await notesRepository.getAll();

        if (!this.filter) {
            return allNotes;
        }

        let filtered = [];

        if (this.filter.tag) {
            filtered = allNotes.filter(x => x.title.indexOf('#' + this.filter.tag) > -1);
        }

        return filtered;
    }

    async saveFilter(filter) {
        this.filter = filter;
    }

}

export default ListsView;