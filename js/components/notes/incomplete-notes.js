import preferencesRepository from "../../storage/preferences-repository.js";
import NoteItem from './note-item.js';

export default {

    components: {
        NoteItem,
    },

    props: {
        notes: Array,
    },

    template: `
    <ul class="notes-list-box">
        <li v-for="note in notes" class="notes-item note" :class="{ starred: note.starred }" :id="'note-' + note.id">
            <NoteItem :note="note" />
        </li>
    </ul>
    `,

}