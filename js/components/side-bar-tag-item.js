import messageBus from '../classes/shared-message-bus.js';

export default {

    props: {
        tag: Object,
    },

    template: `
# <span class="tag-btn"  @click="activateTag">{{ tag.title }}</span>
<span class="flex-box-3-push counter">{{ tag.count }}</span>
    `,

    methods: {
        async activateTag() {
            messageBus.publish('tag:activated', { id: this.tag.id });
        }
    },

}