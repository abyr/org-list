import View from "../classes/view.js";
import timeLogsRepository from "../storage/time-logs-repository.js";

const UPDATE_INTERVAL = 500;

class TimerView extends View {
    getHtml() {
        return `
            <div class="box-v16">
                <span id="timer-value">00:00:00</span>
            </div>
            <div class="timer-controls">
                <button id="start-timer" aria-label="Start">START</button>
                <button id="stop-timer" aria-label="Stop">STOP</button>            
            </div>
            <div class="box-16" id="time-logs-list"></div>
        `;
    }

    postRender() {
        super.postRender();

        const startBtn = this.queue('#start-timer');
        const stopBtn = this.queue('#stop-timer');

        this.subscribeElementEvent(startBtn, 'click', this.startTimer.bind(this));
        this.subscribeElementEvent(stopBtn, 'click', this.stopTimer.bind(this));

        this.renderLogs();
    }

    async renderLogs() {
        const timeLogs = await timeLogsRepository.getAll();

        timeLogs.sort(this.timeLogsSorter);

        console.log('time logs', timeLogs);

        this.started = timeLogs.find(x => x.startAt > 0 && !x.endAt);

        const startBtn = this.queue('#start-timer');
        const stopBtn = this.queue('#stop-timer');

        if (this.started) {
            this.continuousUpdate();

            startBtn.disabled = true;
            stopBtn.disabled = false;

        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }

        const html = timeLogs.length ? `
            <ul class="time-logs-box">
                ${timeLogs.map(x => {
                    if (x.endAt) {
                        return `
                            <li class="time-log id="${x.id}">
                                <span class="time-log-date">${this.tsToDate(x.startAt)}</span>
                                <span class="box-h16 time-log-duration">${this.msToDuration(x.endAt - x.startAt)}</span>
                                <span class="time-log-comment">${x.comment || '...'}</span>
                            </li>
                        `;
                    }
                    return `
                        <li class="time-log id="${x.id}">
                            <span class="time-log-date">${this.tsToDate(x.startAt)}</span>
                            <span class="box-h16 time-log-duration">${this.msToDuration(x.endAt - x.startAt)}</span>
                            <span class="time-log-comment">${x.comment || '...'}</span>
                        </li>
                    `;
                }).join('')}
            </ul>
        ` : `No time logs`;

        const listBox = this.queue('#time-logs-list');

        listBox.innerHTML = html;
    }

    renderControls() {
        if (this.started) {
            this.continuousUpdate();

            startBtn.disabled = true;
            stopBtn.disabled = false;

        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }

    async startTimer() {
        console.log('start');

        if (this.started) {
            return;
        }

        const startedId = await timeLogsRepository.create({
            startAt: Date.now(),
            comment: 'testing'
        });

        this.started = await timeLogsRepository.get(startedId);

        this.renderControls();
        this.continuousUpdate();
    }

    async stopTimer() {
        console.log('stop', this.started.id);

        await timeLogsRepository.update(this.started.id, Object.assign({}, this.started, {
            endAt: Date.now()
        }));

        this.started = null;

        this.stopUpdates();

        this.renderControls();
        this.renderLogs();
    }

    continuousUpdate() {
        this.updateTimerValue();

        this.updateTimer = setTimeout(() => {
            if (this.started) {
                this.continuousUpdate();

            } else {
                this.stopUpdates();
            }``
        }, UPDATE_INTERVAL);
    }

    stopUpdates() {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
    }

    async updateTimerValue() {
        const started =  this.started;

        let timeStr = '00:00:00';

        if (started) {
            timeStr = this.msToDuration(Date.now() - started.startAt);
        }

        this.setTimerValue(timeStr);
    }

    setTimerValue(str) {
        const el = this.queue('#timer-value');

        if (el.innerHTML !== str) {
            el.innerHTML = str;
        }

    }

    tsToDate(ts) {
        const date = new Date(ts);

        return date.toISOString().substring(0, 10);
    }

    tsToTime(ts) {
        const date = new Date(ts);

        return date.toISOString().substring(11, 19);
    }

    msToDuration(ms) {
        const hrs = Math.floor((ms / (1000*60*60))%24);
        const min = String(Math.floor((ms/(1000*60))%60)).padStart(2, '0');
        const sec = String(((ms/1000)%60).toFixed(0)).padStart(2, '0');

        const hh = String(hrs).padStart(2, '0');
        const mm = String(min).padStart(2, '0');
        const ss = String(sec).padStart(2, '0');

        return `${hh}:${mm}:${ss}`; 
    }

    timeLogsSorter(a, b) {
        return b.startAt - a.startAt;
    }

}

export default TimerView;