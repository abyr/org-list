export default {
    props: {
        note: Object,
    },

    template: `
<div class="note-details">
    <div :id="'note-title-' + note.id"
        role="textbox"
        contenteditable="true"
        aria-placeholder="title"
        aria-label="Note title"
    >
        <b>{{ note.title }}</b>
    </div>

    <div class="box-v16">
        <div>Starred: {{ note.starred ? 'yes' : 'no' }}</div>

        <div>Created at: {{ createdLocale }}</div>

        <div>Updated at: {{ updatedLocale }}</div>
    </div>
</div>
    `,

    mounted() {
        console.log('note:', this.note);
    },

    computed: {
        createdLocale() {
            return this.note.createdAt ?
                new Date(this.note.createdAt).toLocaleString() :
                '...';
        },

        updatedLocale() {
            return this.note.updatedAt ?
                new Date(this.note.updatedAt).toLocaleString() :
                '...';
        },
    },

    methods: {
        applyTitle() {

        },
    },

}