import { ref } from 'vue';

import staticLists from '../storage/static-lists.js';

export default {

    setup() {
        const systemLists = ref(staticLists);

        return { systemLists };
    },

    props: {
        lists: Array,
    },

    template: `

<ul class="box-top16">
    <li v-for="list in systemLists" class="flex-box-3 list-item" :data-id="list.id">
        <span class="list-btn-icon" v-html="list.icon"></span>
        <span class="list-btn">{{ list.title }}</span>
        <span class="flex-box-3-push counter">
            {{ list.notes && list.notes.length ? list.notes.length : '' }}
        </span>
    </li>
</ul>

<ul>
    <li v-for="list in lists" class="flex-box-3 list-item" :data-id="list.id">
        <span class="list-btn-icon">&#9776;</span>
        <span class="list-btn">{{ list.title }}</span>
        <span class="flex-box-3-push counter"> {{ list.incompleteLen || 0 }} </span>
    </li>
</ul>

<div id="tags" class="box box-v16"></div>

<div class="add-list-box box-top16">
    <input id="add-list-input" class="add-list-input" type="text" placeholder="+ Add a list..." />
</div>
    `,

}