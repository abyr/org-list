import messageBus from '../../classes/shared-message-bus.js';
import notesRepository from '../../storage/notes-repository.js';

export default {

    props: {
        note: Object,
    },

    template: `
<div class="headline" :class="{ completed: !!note.completed }" >
    <input type="checkbox"
        :aria-labelledby="'toggle-completed-' + note.id + '-label'"
        :id="'toggle-completed-' + note.id"
        class="toggle-completed"
        :data-id="note.id"
        value="note.completed"
        v-model="note.completed"
        @click.prevent="toggleCompleted"
    />

    <span class="headline-text"
        draggable="true"
        :id="'toggle-completed-' + note.id + '-label'"
        :data-id="note.id"
        @click="openNoteDetails"
    >{{ note.title }}</span>

</div>

<div class="controls">

    <button v-if="!note.completed"
        class="star"
        :class="{ starred: note.starred }"
        :data-id="note.id"
        :aria-label="note.starred ? 'Unstar' : 'Star'"
        v-html="note.starred ? '&starf;' : '&star;'"
        @click.prevent="toggleStarred"
    ></button>

    <button class="delete" :data-id="note.id" aria-label="Delete" @click.prevent="deleteNote">✕</button>
</div>
    `,

    methods: {
        async toggleCompleted() {
            const isCompleted = !this.note.completed;

            this.note.completed = isCompleted;

            if (isCompleted) {
                this.note.starred = false;
            }

            await notesRepository.update(this.note.id, this.note);
        },

        async toggleStarred() {
            const isCompleted = this.note.completed;

            if (isCompleted) {
                return false;
            }

            this.note.starred = !this.note.starred;

            await notesRepository.update(this.note.id, this.note);
        },

        async deleteNote() {
            if (!window.confirm('Delete note?')) {
                return;
            }

            await notesRepository.delete(this.note.id);

            this.note.deleted = true;
        },

        async openNoteDetails() {
            messageBus.publish('note:opened', { id: this.note.id });
        }
    },

}