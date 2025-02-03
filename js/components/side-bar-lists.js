import SideBarStaticLists from './side-bar-static-lists.js';
import SideBarListItem from './side-bar-list-item.js';

export default {

    components: {
        SideBarListItem,
        SideBarStaticLists,
    },

    props: {
        lists: Array,
    },

    template: `

<SideBarStaticLists />

<ul>
    <li v-for="list in lists" class="flex-box-3 list-item" :data-id="list.id">
        <SideBarListItem :list="list" />
    </li>
</ul>

<div id="tags" class="box box-v16"></div>

<div class="add-list-box box-top16">
    <input id="add-list-input" class="add-list-input" type="text" placeholder="+ Add a list..." />
</div>
    `,

}