import NotesView from "./notes-view.js";

class IncompleteNotesView extends NotesView {
    getEmptyHtml() {
        return `Nothing to do.`;
    }
}

export default IncompleteNotesView;