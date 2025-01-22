import { ref } from 'vue';

import SideBarLists from './side-bar-lists.js';
import MiddleBarNotes from './middle-bar-notes.js';
import listsRepository from '../storage/lists-repository.js';
import notesRepository from '../storage/notes-repository.js';

export default {
   
    data() {
        return {
            lists: [],
            notes: [],
            search: '',
        }
    },

    components: {
        SideBarLists,
        MiddleBarNotes,
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
            <div class="middle-bar-header"></div>
            <div class="middle-bar-content box-top16">
                <MiddleBarNotes :search="search" :notes="notes" />
            </div>
        </div>
    </div>
    <div class="flex-box-3-col-3 hidden">
        <div class="last-bar box-16"></div>
    </div>
</div>

<div id="footer" class="box-16"></div>
    `,

    mounted() {
        this.getLists();
    },

    methods: {

        async getLists() {
            const lists = await listsRepository.getAll();

            this.lists = lists;
        },

        async getNotes() {
            const notes = await notesRepository.getAll();

            this.notes = notes;
        }
    }

};
