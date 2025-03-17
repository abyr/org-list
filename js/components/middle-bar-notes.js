import CompletedNotes from './notes/completed-notes.js';
import IncompleteNotes from './notes/incomplete-notes.js';

export default {

    props: {
        notes: Array,
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
    <div class="incomplete-notes">
        <IncompleteNotes :notes="incompleteNotes" />
    </div>

    <div class="completed-notes" v-if="completedNotes.length">
        <CompletedNotes :notes="completedNotes" />
    </div>
</div>
    `,

}