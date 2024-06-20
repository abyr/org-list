import View from '../classes/view.js';
import NoteView from './note-view.js';

class NotesView extends View {

    postRender() {
        const notes = this.getNotes();

        notes.forEach(x => {
            const noteView = new NoteView({
                element: this.element.querySelector('#note-' + x.id)
            });

            noteView.setNote(x);
            noteView.render();
        });
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
