import CompletedNotes from './notes/completed-notes.js';
import IncompleteNotes from './notes/incomplete-notes.js';
import AddNote from './notes/add-note.js';

export default {

    props: {
        notes: Array,
        search: String,
    },

    components: {
        CompletedNotes,
        IncompleteNotes,
        AddNote,
    },

    computed: {
        allNotes() {
            return this.notes.filter(x => !x.deleted);
        },

        incompleteNotes() {
            const allNotes = this.allNotes;
            const incompleteNotes = allNotes.filter(x => !x.completed);

            return incompleteNotes;
        },

        completedNotes() {
            const allNotes = this.allNotes;
            const completedNotes = allNotes.filter(x => !!x.completed);

            return completedNotes;
        },
    },

    template: `

<div id="notes">
    <div class="add-note-box">
        <AddNote />
    </div>

    <div class="flex-box-3 box-v16" v-if="search">
        <button id="reset-filter-btn"> < </button>
            <span> {{ search }}</span>
    </div>

    <div class="incomplete-notes">
        <IncompleteNotes :notes="incompleteNotes" />
    </div>

    <div class="completed-notes" v-if="completedNotes.length">
        <CompletedNotes :notes="completedNotes" />
    </div>
</div>
    `,

}