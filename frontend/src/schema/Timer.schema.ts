class Timer {
    private timer: NodeJS.Timeout | null;
    public time: number;
    public timerIsRunning: boolean;
    public status: 0 | 1 | 2;
    public sessionDurations: number[];
    public isPomo: boolean
    public autoStart: boolean
    public completedShorts: number
    public shortsNeeded: number
    public loopsNeeded: number
    public completedLoops: number
    private callbacks: {
        onStart?: () => void;
        onTick?: (time: number) => void;
        onPause?: () => void;
        onReset?: () => void;
        onComplete?: () => void;
    };

    constructor() {
        this.time = 0;
        this.timerIsRunning = false;
        this.status = 0;
        this.sessionDurations = [25 * 60, 5 * 60, 10 * 60];
        this.timer = null;
        this.isPomo = true;
        this.callbacks = {};
        this.autoStart = false;
        this.completedShorts = 0;
        this.shortsNeeded = 1;
        this.loopsNeeded = 4;
        this.completedLoops = 0;
    }

    setCallbacks(callbacks: Partial<Timer['callbacks']>): void {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    start(): void {
        if (!this.timerIsRunning) {
            if (this.isPomo && this.time >= 0) {
                this.timerIsRunning = true;
                this.timer = setInterval(() => this.tick(), 1000);
                if (this.callbacks.onStart) this.callbacks.onStart();
            }
        }
    }

    changeStatus(newStatus: 0 | 1 | 2): void {
        this.timerIsRunning = false
        this.status = newStatus;
        this.time = this.sessionDurations[this.status];

        if(this.completedLoops === this.loopsNeeded){
            this.completedLoops = 0
        }

        if (this.callbacks.onReset) {
            this.callbacks.onReset();
        }

        if (this.callbacks.onTick) {
            this.callbacks.onTick(this.time);
        }
    }

    pause(): void {
        if (this.timerIsRunning) {
            if (this.timer) clearInterval(this.timer);
            this.timerIsRunning = false;
            if (this.callbacks.onPause) this.callbacks.onPause()
        }
    }

    reset(): void {
        if (this.completedLoops === this.loopsNeeded) {
            this.status = 0;
            this.completedLoops = 0;
        }
        if (this.timer) clearInterval(this.timer);
        this.timerIsRunning = false;
        this.time = this.sessionDurations[this.status];
        if (this.callbacks.onReset) this.callbacks.onReset();
    }

    completeSession(): void {
        if (this.timer) clearInterval(this.timer);
        this.timerIsRunning = false;
        if (this.status <= this.sessionDurations.length - 1) {
            if (this.status === 2 && this.completedLoops < this.loopsNeeded) {
                this.completedLoops += 1;
                if (this.completedLoops < this.loopsNeeded) {
                    console.log("Status set back to 0 because loops are not completed.");
                    this.status = 0;
                }
            } else if (this.status === 1) {
                console.log("Status set back to 0 after completing short break.");
                this.status = 0;
                this.completedShorts += 1;
            } else if (this.status === 0 && this.completedShorts >= this.shortsNeeded) {
                console.log("Status set to 2 after completing pomodoro sessions.");
                this.status = 2;
                this.completedShorts = 0;
            } else if (this.status === 0 && this.completedShorts < this.shortsNeeded) {
                console.log("Status set to 1 after completing pomodoro session.");
                this.status = 1; 
            }
            if (this.completedLoops < this.loopsNeeded) {
                this.time = this.sessionDurations[this.status];
            }
            if (this.callbacks.onTick) this.callbacks.onTick(this.time);
        } else {
            if (this.loopsNeeded === this.completedLoops) {
                console.log("All loops completed. Timer completed!");
                if (this.callbacks.onComplete) this.callbacks.onComplete();
                return;
            }
        }
    }

    isSessionDone(): boolean {
        return this.completedLoops === this.loopsNeeded
    }

    addOneMinute(): void {
        this.time += 60;
        if(this.loopsNeeded === this.completedLoops){
            this.completedLoops -= 1
        }
        if (this.time > this.sessionDurations[this.status]) {
            this.time = this.sessionDurations[this.status];
        }
        if (this.callbacks.onTick) {
            this.callbacks.onTick(this.time);
        }

    }

    removeOneMinute(): void {
        const timeRemaining = this.time;
        if (timeRemaining > 60) {
            this.time -= 60;
        } else {
            this.time = 0
        }
        if (this.isPomo && this.time <= 0) {
            this.completeSession();
        }

        if (this.callbacks.onTick) {
            this.callbacks.onTick(this.time);
        }

    }

    tick(): void {
        if (this.timerIsRunning) {
            if (this.isPomo && this.time <= 0) {
                this.completeSession();
                return
            }
            if (this.isPomo) {
                this.time = this.time - 1;
            } else {
                this.time = this.time + 1;
            }
            if (this.callbacks.onTick) {
                this.callbacks.onTick(this.time);
            }
        }
    }
}

export default Timer;
