
import notesRepository from '../storage/notes-repository.js';

export default {

    props: {
        notes: Array,
    },

    computed: {
        completedNotes() {
            return this.notes.filter(x => x.completed && !x.deleted);
        }
    },

    methods: {
        async deleteCompleted() {
            if (!window.confirm('Delete all completed notes?')) {
                return;
            }

            this.completedNotes.forEach(async (x) => {
                await notesRepository.delete(x.id);
                x.deleted = true;
            });
        }
    },

    template: `
<button 
    id="delete-completed"
    aria-label="Delete completed"
    :disabled="!completedNotes.length"
    @click.prevent="deleteCompleted"
>&#10005; Delete completed</button>`,

}