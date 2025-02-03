import { ref } from 'vue';
import messageBus from '../classes/shared-message-bus.js';
import staticLists from '../storage/static-lists.js';

export default {

    setup() {
        const systemLists = ref(staticLists);

        return { systemLists };
    },

    template: `
<ul class="box-top16">
    <li v-for="list in systemLists" class="flex-box-3 list-item" :data-id="list.id">
        <span class="list-btn-icon" v-html="list.icon"></span>
        <span class="list-btn" @click="activateStaticList" :data-id="list.id">{{ list.title }}</span>
        <span class="flex-box-3-push counter">
            {{ list.notes && list.notes.length ? list.notes.length : '' }}
        </span>
    </li>
</ul>

    `,

    methods: {
        async activateStaticList(event) {
            const listId = event.target.dataset.id;

            messageBus.publish('static-list:activated', { id: listId });
        }
    },

}