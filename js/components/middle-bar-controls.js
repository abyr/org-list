
import notesRepository from '../storage/notes-repository.js';

export default {

    props: {
        notes: Array,
    },

    methods: {
        async deleteCompleted() {
            if (!window.confirm('Delete all completed notes?')) {
                return;
            }

            const completedNotes = this.notes.filter(x => x.completed);
            
            completedNotes.forEach(async (x) => {
                await notesRepository.delete(x.id);
                x.deleted = true;
            });
        }
    },

    template: `
<button 
    id="delete-completed"
    aria-label="Delete completed"
    @click.prevent="deleteCompleted"
>&#10005; Delete completed</button>`,

}