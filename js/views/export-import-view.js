import View from '../classes/view.js';
import ExportImport from '../export-import.js';

class ExportImportView extends View {

    constructor({ element }) {
        super({ element });

        this.importExport = new ExportImport();
    }

    render() {
        super.render();

        document.getElementById('exporter').addEventListener('click', this.export.bind(this));
        document.getElementById('importer').addEventListener('change', this.import.bind(this));
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

    async import() {
        if (!window.confirm('All data will be replaced by the imported file. Continue?')) {
            return;
        }
        await this.importExport.init();
        this.importExport.importFile(e);

        window.location.reload();
    }

    destroy() {
        document.getElementById('exporter').removeEventListener('click', this.export);
        document.getElementById('importer').removeEventListener('change', this.import);
        this.importExport = null;
        super.destroy();
    }
}

export default ExportImportView;