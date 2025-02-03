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
            listId: 0,
            staticListId: 0,
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

        messageBus.subscribe('list:activated', this.activateList.bind(this));
        messageBus.subscribe('static-list:activated', this.activateStaticList.bind(this));



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

        activateList({ id }) {
            this.deactivateLists();
            this.closeNoteDetails();

            this.listId = id;

            this.updateNotes();
        },

        activateStaticList({ id }) {
            this.deactivateLists();
            this.closeNoteDetails();

            this.staticListId = id;

            this.updateNotes();
        },

        deactivateLists() {
            this.listId = 0;
            this.staticListId = 0;
        },

        resetFilters() {
            this.listId = 0;
        },

        openNoteDetails({ id }) {
            this.noteId = id;
        },


        closeNoteDetails() {
            this.noteId = 0;
        },

        async updateNotes() {
            await this.getNotes();
        },

        async getLists() {
            const lists = await listsRepository.getAll();

            this.lists = lists;
        },

        async getNotes() {
            const notes = await this.getFilteredNotes();

            this.notes = notes.sort(sortByTimeDESC)
                .sort(sortByStarredASC);
        },

        async getFilteredNotes() {
            if (this.listId) {
                return await this.getNotesFilteredByList();

            } else if (this.staticListId) {
                return await this.getNotesFilteredByStaticList();

            } else if (this.search) {
                return await this.getNotesFilteredBySearch();

            } else {
                return await this.getAllNotes();
            }
        },

        async getNotesFilteredByList() {
            const list = await listsRepository.get(this.listId);
            const notes = await this.getAllNotes()

            const listedNotes = notes.filter(note => list.notes.includes(note.id));

            return listedNotes;
        },

        async getNotesFilteredByStaticList() {
            if (this.staticListId === 'inbox') {
                return await this.getAllNotes();

            } else if (this.staticListId === 'starred') {
                const notes = await this.getAllNotes();

                const starredNotes = notes.filter(x => !!x.starred);

                return starredNotes;
            }
        },


        async getNotesFilteredBySearch() {
            const notes = await this.getAllNotes();

            return notes;
        },

        async getAllNotes() {
            const notes = await notesRepository.getAll();

            return notes;
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
