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
        allNotes() {
            return this.notes.filter(x => !x.deleted);
        },

        incompleteNotes() {
            const allNotes = this.allNotes;

            const incompleteNotes = allNotes.filter(x => !x.completed);

            console.log('incomplete notes len', incompleteNotes.length);

            return incompleteNotes;
        },

        completedNotes() {
            const allNotes = this.allNotes;

            const completedNotes = allNotes.filter(x => !!x.completed);

            console.log('completed notes len', completedNotes.length);

            return completedNotes;
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

    <div class="incomplete-notes">
        <IncompleteNotes :notes="incompleteNotes" />
    </div>

    <div class="completed-notes" v-if="completedNotes.length">
        <CompletedNotes :notes="completedNotes" />
    </div>
</div>
    `,

}