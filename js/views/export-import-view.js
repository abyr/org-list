import View from '../classes/view.js';
import ExportImport from '../export-import.js';

class ExportImportView extends View {

    constructor({ element }) {
        super({ element });

        this.importExport = new ExportImport();
    }

    render() {
        super.render();

        const exportBtn = document.getElementById('exporter');

        this.subscribeElementEvent(exportBtn, 'click', this.export.bind(this));

        this.subscribeElementEvent(document.getElementById('importer'), 'change', this.import.bind(this));
    }

    getHtml() {
        return `
             <input type="button" value="Export" id="exporter" />
             <label for="importer">Import</label>
             <input type="file" id="importer">
        `;
    }

    async export() {
        await this.importExport.init();
        await this.importExport.export();
    }

    async import(event) {
        if (!window.confirm('All data will be replaced by the imported file. Continue?')) {
            return;
        }
        await this.importExport.init();
        this.importExport.importFile(event);

        window.location.reload();
    }

    destroy() {
        this.importExport = null;
        super.destroy();
    }
}

export default ExportImportView;