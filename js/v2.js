import { createApp } from 'vue';

import Box3Layout from './components/box3-layout.js';

const app = createApp({
    components: {
        Box3Layout,
    },
    template: `<Box3Layout />`
});

app.mount('#org-list');