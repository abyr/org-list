import notesRepository from '../../storage/notes-repository.js';
import messageBus from '../../classes/shared-message-bus.js';

export default {
    data() {
        return {
          newTitle: '',
        }
    },

    methods: {
        async addNote() {
            const newId = await notesRepository.create({
                title: this.newTitle,
            });

            this.newTitle = '';

            messageBus.publish('notes:updated', {
                action: 'create',
                id: newId,
            });
        },
    },

    template: `
<input
    id="add-note-input"
    class="add-note-input"
    type="text"
    placeholder="+ Add a note..."
    v-on:keyup.enter="addNote"
    v-model="newTitle"
/>
    `,

}