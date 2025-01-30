import SideBarLists from './side-bar-lists.js';
import MiddleBarNotes from './middle-bar-notes.js';
import MiddleBarControls from './middle-bar-controls.js';
import NoteDetails from './notes/note-details.js';
import listsRepository from '../storage/lists-repository.js';
import notesRepository from '../storage/notes-repository.js';
import messageBus from '../classes/shared-message-bus.js';

export default {

    data() {
        return {
            lists: [],
            notes: [],
            search: '',
            noteId: 0,
        };
    },

    components: {
        SideBarLists,
        MiddleBarNotes,
        MiddleBarControls,
        NoteDetails,
    },

    template: `
<div class="flex-box-3">
    <div class="flex-box-3-col-1">

        <div class="side-bar box-16">
            <div class="side-bar-header"> Orglist v2 </div>
            <div class="side-bar-content">
                <div id="lists">
                    <SideBarLists :lists="lists"/>
                </div>
            </div>
        </div>

    </div>
    <div class="flex-box-3-col-2">
        <div class="middle-bar box-16">
            <div class="middle-bar-header">
                <MiddleBarControls :notes="sortedNotes" />
            </div>
            <div class="middle-bar-content box-top16">
                <MiddleBarNotes :search="search" :notes="sortedNotes" />
            </div>
        </div>
    </div>
    <div class="flex-box-3-col-3" v-if="noteId">
        <div class="last-bar box-16">
            <div class="last-bar-header">
                <button class="close" aria-label="Close" @click="closeNoteDetails">✕</button>
            </div>
            <div class="last-bar-content">
                <NoteDetails :note="openedNote" />
            </div>
        </div>
    </div>
</div>

<div id="footer" class="box-16"></div>
    `,

    mounted() {
        messageBus.subscribe('notes:updated', this.updateNotes.bind(this));
        messageBus.subscribe('note:opened', this.openNoteDetails.bind(this));

        this.getLists();
        this.getNotes();
    },

    computed: {
        sortedNotes() {
            return this.notes
                .sort(sortByTimeDESC)
                .sort(sortByStarredASC)
        },
        openedNote() {
            if (this.noteId) {
                return this.notes.find(x => x.id === this.noteId);
            } else {
                return null;
            }
        }
    },

    methods: {

        async getLists() {
            const lists = await listsRepository.getAll();

            this.lists = lists;
        },

        async updateNotes() {
            await this.getNotes();
        },

        async getNotes() {
            const notes = await notesRepository.getAll();

            this.notes = notes.sort(sortByTimeDESC)
                .sort(sortByStarredASC)
        },

        openNoteDetails({ id }) {
            this.noteId = id;
        },

        closeNoteDetails() {
            this.noteId = 0;
        },
    }

};

function sortByTimeDESC (a, b) {
    const aTime = a.updatedAt || a.createdAt;
    const bTime = b.updatedAt || b.createdAt;

    return bTime - aTime;
}

function sortByStarredASC (a, b) {
    return (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
}
