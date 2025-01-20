export class Timer {
    isRunning = false;
    currentTime = 0;
    constructor(time) {
        this.setTime = time;
    }
    paused = false;

    getSec() {
        return this.setTime - this.currentTime
    }

    pause() {
        this.paused= true;
    }

    continue() {
        this.paused = false;
    }

    getTime() {
        let min = Math.floor((this.getSec() / 60))
        let sec  = (this.getSec() - min * 60);
        return `${min}:${(sec < 10 ? "0" + sec : sec)}`
    }

    start() {
    setInterval(()=> {
        if (this.setTime > this.currentTime && !this.paused) {
        this.currentTime +=1;
        }
    }, 1000);

    }



}