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
                aria-labelledby="noteTitleLabel"
            ><b>${note.title}</b></div>
            
            <div class="box-v16">
                <div>
                    Starred: ${this.note.starred ? 'yes' : 'no'}
                </div>


                <div>
                    Created at: ${this.note.createdAt ? new Date(this.note.createdAt).toLocaleString() : '...'}
                </div>
                

                <div>
                    Updated at: ${this.note.updatedAt ? new Date(this.note.updatedAt).toLocaleString() : '...'}</div>
                </div>
            </div>
        `;
    }

    async applyEvents() {
        const titleEl = this.element.querySelector('#note-title-' + this.note.id);

        this.subscribeElementEvent(titleEl, 'blur', this.applyTitle.bind(this));
    }

    postRender() {
        const el = this.queue('[contenteditable="true"]');

        this.subscribeElementEvent(el, 'keydown', this.saveOnEnter.bind(this));
    }

    saveOnEnter(event) {
        if (event.code === 'Enter') {
            event.preventDefault();

            this.applyTitle(event);
        }

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

    async setNote(note) {
        this.note = note;

        const lists = await listsRepository.getAll();

        const list = lists.find(x => x.notes && x.notes.includes(note.id));

        this.list = list || {};
    }

}

export default NoteDetailsView;