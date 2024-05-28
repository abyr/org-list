import View from './classes/view.js';

class LayoutView extends View {

    getHtml() {
        const len = 0;

        return `
            Have ${len} notes.
        `;
    }
}

export default LayoutView;