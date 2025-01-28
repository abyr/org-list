import Collapsible from '../../views/components/collapsible.js';
import preferencesRepository from "../../storage/preferences-repository.js";
import NoteItem from './note-item.js';

export default {

    data() {
        return {
            showCompleted: true
        };
    },

    components: {
        NoteItem,
    },

    props: {
        notes: Array,
    },

    computed: {
        ariaExpanded() {
            return this.showCompleted ? 'true' : 'false';
        },
    },

    mounted() {
        this.getShowCompleted();

        const completedNotesHeader = document.querySelector('#completed-notes-header');

        new Collapsible(completedNotesHeader, {
            onToggle: this.updateShowCompletedPreference
        });
    },

    methods: {
        async getShowCompleted() {
            const showCompletedPreference = await preferencesRepository.get('show-completed');

            this.showCompleted = showCompletedPreference && showCompletedPreference.value;;
        },
        
        async updateShowCompletedPreference(isExpanded) {
            await preferencesRepository.update('show-completed', isExpanded);

            this.getShowCompleted();
        }
    },

    template: `
<div class="collapsible">
    <div class="collapsible-header" id="completed-notes-header">
        <button type="button"
            :aria-expanded="ariaExpanded"
            class="collapsible-trigger"
            aria-controls="completed-notes-section-toggle"
            id="completed-notes-section"
        >
            <span class="collapsible-title">
                Completed notes ({{ notes.length }})
                <span class="collapsible-icon"></span>
            </span>
        </button>
    </div>
    <div id="completed-notes-section-toggle"
            role="region"
            aria-labelledby="completed-notes-section"
            class="collapsible-content"
            :aria-expanded="ariaExpanded"
    >        
        <ul class="notes-list-box">
            <li v-for="note in notes" class="notes-item note" :class="{ starred: note.starred }" :id="'note-' + note.id">
                <NoteItem :note="note" />
            </li>
        </ul>
    </div>
</div>
    `,

}