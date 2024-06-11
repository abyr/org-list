import NotesStoreAdapter from './storage/notes-adapter.js';

class ExportImport {

    constructor() {}

    async init() {
        this.notesAdapter = new NotesStoreAdapter();

        await this.notesAdapter.connect();
    }

    async save(item, { title, starred, position, completed  }) {
        await this.notesAdapter.put(item, {
            title, 
            starred,
            position, 
            completed,
            createdAt,
            updatedAt,
        });
    }

    async getAll() {
        return await this.notesAdapter.getAll();
    }

    async export() {        
        var exportData = await this.notesAdapter.getAllMap();

        var _exportData = JSON.stringify(exportData , null, 4);

        var vLink = document.createElement('a'),
            vBlob = new Blob([_exportData], {
                type: 'octet/stream'
            }),
            vName = this.getFileName(),
            vUrl = window.URL.createObjectURL(vBlob);

        vLink.setAttribute('href', vUrl);
        vLink.setAttribute('download', vName);

        vLink.click();
    }    

    importFile(event) {
        var files = event.target.files;

        if (files.length === 0) {
            console.log('No file is selected');
            return;
        }

        var reader = new FileReader();

        reader.onload = async event => {
            var src = event.target.result;
            var json = JSON.parse(src);

            await this.notesAdapter.clear();

            Object.values(json).forEach(async x => {
                await this.notesAdapter.put(x.id, x);
            });
        };
        reader.readAsText(files[0]);
    }

    getFileName() {
        const date = new Date();

        const isoStamp = date.toISOString().slice(0,19)
            .replace(/[\-:]/gi, '')
            .replace('T', '-');

        return `orglist-${isoStamp}.json`;
    }

}

export default ExportImport;