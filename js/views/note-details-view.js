import View from '../classes/view.js';
import notesRepository from '../storage/notes-repository.js';
import listsRepository from '../storage/lists-repository.js';
import messageBus from '../classes/shared-message-bus.js';

class NoteDetailsView extends View {

    getHtml() {
        const note = this.note;

        return `
            <div id="note-title-${note.id}"
                role="textbox"
                contenteditable="true"
                aria-placeholder="title"
                aria-labelledby="noteTitleLabel">${note.title}</div>
                
            <div class="box-v16" id="select-list-box-${note.id}">
                <label for="select-list-for-${this.note.id}">List</label>
                
                <select id="select-list-for-${this.note.id}">
                    <option value="">Unlisted</option>
                </select>
            </div>
        `;
    }

    async applyEvents() {
        const titleEl = this.element.querySelector('#note-title-' + this.note.id);

        this.subscribeElementEvent(titleEl, 'blur', this.applyTitle.bind(this));

        const selectListEl = this.element.querySelector(`#select-list-for-${this.note.id}`);
        this.subscribeElementEvent(selectListEl, 'change', this.applyList.bind(this));

    }

    async postRender() {
        const lists = await listsRepository.getAll();
        const listId = this.list && this.list.id;

        const selectListEl = this.element.querySelector(`#select-list-for-${this.note.id}`);

        const selectHtml = `
            <option value="" ${this.list ? '' : 'selected' }>Unlisted</option>
        
            ${lists.map(list => {
                return `<option value="${list.id}" 
                            ${listId && list.id === listId ? 'selected' : '' }
                        >${list.title}</option>`;
            }).join('')}
        `;

        selectListEl.innerHTML = selectHtml;
    }

    async applyTitle(event) {
        const newTitle = event.currentTarget.innerText.trim();

        if (this.note.title === newTitle) {
            return;
        }
        this.note.title = newTitle.trim();

        await notesRepository.update(Number(this.note.id), this.note);

        messageBus.publish('note:updated', {
            action: 'update',
            id: this.note.id,
        });
    }

    async applyList(event) {
        const listId = event.currentTarget.value;

        if (!listId) {
            return await this.removeFromList();
        }

        const list = await listsRepository.get(listId);

        if (list.notes) {
            if (list.notes.includes(this.note.id)) {
                return
            }

            list.notes.push(this.note.id);
        } else {
            list.notes = [this.note.id];
        }

        await listsRepository.update(listId, list);

        console.log('apply list', list);
    }

    async removeFromList() {
        const index = this.list.notes.indexOf(this.note.id);

        if (index > -1) {
            this.list.notes.splice(index, 1);

            await listsRepository.update(this.list.id, this.list);
        }
    }

    async setNote(note) {
        this.note = note;

        const lists = await listsRepository.getAll();

        const list = lists.find(x => x.notes && x.notes.includes(note.id));

        this.list = list || {};
    }

}

export default NoteDetailsView;