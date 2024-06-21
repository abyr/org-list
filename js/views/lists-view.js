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
                        <li class="flex-box-3" data-id="${list.id}">
                            <span>&#9776; ${list.title}</span> 
                            <span class="flex-box-3-push counter">
                                ${list.notes && list.notes.length ? list.notes.length : ''}
                            </span>
                        </li>
                    `;
                }).join('')}
            </ul>
            
            <div class="add-list-box box-top16 hidden">
                <input id="add-list-input" class="add-list-input" type="text" placeholder="Add a list..." />
            </div>
            
            <div id="tags" class="box box-v16"></div>
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

export default ListsView;