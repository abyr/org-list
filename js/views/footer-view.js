import View from '../classes/view.js';
import ExportImportView from "./export-import-view.js";
import TimerView from './time-logs-view.js';

class FooterView extends View {

    getHtml() {
        return `
            <div id="time-logs" class="box-v16"></div>
            <div id="export-import" class="box-v16"></div>
        `;
    }

    postRender() {
        super.postRender();

        this.renderExportImport();
        this.renderTimer();

    }

    renderExportImport() {
        this.expImpView = new ExportImportView({
            element: document.getElementById('export-import')
        });
        this.expImpView.render();
    }

    renderTimer() {
        this.timeLogsView = new TimerView({
            element: document.getElementById('time-logs')
        });
        this.timeLogsView.render();
    }
}

export default FooterView;