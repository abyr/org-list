import View from "../classes/view.js";
import notesRepository from "../storage/notes-repository.js";
import messageBus from "../classes/shared-message-bus.js";

class MiddleBarHeader extends View {
    getHtml() {
        return `
            <button id="delete-completed"
                aria-label="Delete completed"
            >&#10005; Delete completed</button>
        `;
    }

    postRender() {
        super.postRender();

        const x = this.queue('#delete-completed');

        this.subscribeElementEvent(x, 'click', this.removeCompleted.bind(this));
    }

    async removeCompleted() {
        const notes = await notesRepository.getAll();

        const completedNotesIds = notes.filter(x => x.completed).map(x => x.id);

        for (const x of completedNotesIds) {
            await notesRepository.delete(x);
        }

        messageBus.publish('note:updated', {
            action: 'delete',
            ids: completedNotesIds,
        });
    }
}

export default MiddleBarHeader;