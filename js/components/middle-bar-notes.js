import CompletedNotes from './notes/completed-notes.js';
import IncompleteNotes from './notes/incomplete-notes.js';

export default {

    props: {
        notes: Array,
        search: String,
    },

    components: {
        CompletedNotes,
        IncompleteNotes,
    },

    computed: {
        incompleteNotes() {
            return this.notes.filter(x => !x.completed);
        },

        completedNotes() {
            return this.notes.filter(x => x.completed);
        },
    },

    template: `

<div id="notes">
    <div class="add-note-box">
        <input id="add-note-input" 
                class="add-note-input" 
                type="text" 
                placeholder="+ Add a note..." />
    </div>
    
    <div class="flex-box-3 box-v16" v-if="search">
        <button id="reset-filter-btn"> < </button>
            <span> {{ search }}</span>
    </div>

    <IncompleteNotes :notes="incompleteNotes" />

    <CompletedNotes :notes="completedNotes" />
</div>
    `,

}