import NotesView from "./notes-view.js";

class IncompleteNotesView extends NotesView {

    getEmptyHtml() {
        return `<div class="box-v16">Nothing to do.</div>`;
    }
}

export default IncompleteNotesView;