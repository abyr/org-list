import messageBus from '../classes/shared-message-bus.js';

export default {

    props: {
        list: Object,
    },

    template: `
<span class="list-btn-icon" v-html="list.icon"></span>
<span class="list-btn" @click="activateList">{{ list.title }}</span>
<span class="flex-box-3-push counter">
    {{ list.notes && list.notes.length ? list.notes.length : '-' }}
</span>
    `,

    methods: {
        async activateList() {
            messageBus.publish('list:activated', { id: this.list.id });
        }
    },

}