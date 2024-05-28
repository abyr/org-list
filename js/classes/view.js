/**
 * Uses element as parent element for rendering
 */
class View {
    constructor({ element }) {
        this.element = element;
    }

    render() {
        this.element.innerHTML = this.getHtml();
    }

    getHtml() {
        return '<view html>';
    }

    destroy() {
        while(this.element.firstChild) {
            existingContainer.removeChild(existingContainer.firstChild);
        }
    }
}

export default View;