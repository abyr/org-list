import View from '../classes/view.js';
import notesRepository from "../storage/notes-repository.js";
import messageBus from '../classes/shared-message-bus.js';
import NoteView from './note-view.js';

class NotesView extends View {

    render() {
        super.render();

        const notes = this.getNotes();

        notes.forEach(x => {

            const noteView = new NoteView({
                element: this.element.querySelector('#note-' + x.id)
            });

            noteView.setNote(x);

            noteView.render();

        });

        // if (!notes.length) {
        //     return;
        // }
        //
        // const deleteBtnEls = this.element.querySelectorAll('.delete');
        //
        // Array.from(deleteBtnEls).forEach(btn => {
        //     this.subscribeElementEvent(btn, 'click', this.deleteNote.bind(this));
        // });
        //
        // const starBtnEls = this.element.querySelectorAll('.star');
        //
        // Array.from(starBtnEls).forEach(btn => {
        //     this.subscribeElementEvent(btn, 'click', this.starNote.bind(this));
        // });
        //
        // const toggleCompletedEl = this.element.querySelectorAll('.toggle-completed');
        //
        // Array.from(toggleCompletedEl).forEach(btn => {
        //     this.subscribeElementEvent(btn, 'change', this.toggleCompleted.bind(this));
        // });
    }

    getHtml() {
        const notes = this.getNotes();

        if (!notes.length) {
            return this.getEmptyHtml();
        }

        return `
            <ul class="notes-list-box">
                ${notes.map(x => {
                    return `
                        <li class="notes-item note" id="note-${x.id}"></li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    getEmptyHtml() {
        return ``;
    }

    setNotes(notes) {
        this.notes = notes;
    }

    getNotes() {
        return this.notes;
    }

    async getNote(id) {
        return await notesRepository.get(Number(id));
    }

    cleanup() {
        const deleteBtnEls = this.element.querySelectorAll('.delete');

        Array.from(deleteBtnEls).forEach(btn => {
            btn.removeEventListener('click', this.deleteNote);
        });

        const starBtnEls = this.element.querySelectorAll('.star');

        Array.from(starBtnEls).forEach(btn => {
            btn.removeEventListener('click', this.starNote);
        });

        const toggleCompletedEl = this.element.querySelectorAll('.toggle-completed');

        Array.from(toggleCompletedEl).forEach(btn => {
            btn.removeEventListener('change', this.toggleCompleted);
        });

        super.cleanup();
    }

    destroy() {
        this.notes = null;
        super.destroy();
    }
}

export default NotesView;
