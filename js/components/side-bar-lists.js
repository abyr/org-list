import SideBarStaticLists from './side-bar-static-lists.js';
import SideBarListItem from './side-bar-list-item.js';
import SideBarTagItem from './side-bar-tag-item.js';
import listsRepository from '../storage/lists-repository.js';

export default {

    components: {
        SideBarListItem,
        SideBarStaticLists,
        SideBarTagItem,
    },

    props: {
        lists: Array,
        tags: Array,
    },

    data() {
        return {
            newListTitle: '',
        }
    },

    methods: {
        async addList() {
            const newId = await listsRepository.create({
                title: this.newListTitle,
            });
            const theList = await listsRepository.get(newId);

            this.newListTitle = '';

            this.lists.push(theList);
        },
    },

    template: `

<SideBarStaticLists />

<ul class="box-v16">
    <li v-for="list in lists" class="flex-box-3 list-item" :data-id="list.id">
        <SideBarListItem :list="list" />
    </li>
</ul>

<ul class="tags-box list">
    <li v-for="tag in tags" class="flex-box-3 list-item" :data-id="'tag-' + tag.title">
        <SideBarTagItem :tag="tag" />
    </li>
</ul>

<div id="tags" class="box box-v16"></div>

<div class="add-list-box box-top16">
    <input id="add-list-input" class="add-list-input" type="text" placeholder="+ Add a list..."
        v-on:keyup.enter="addList"
        v-model="newListTitle"
    />
</div>
    `,

}