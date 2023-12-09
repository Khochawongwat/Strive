class Pomo {
    private sessionDuration: number;
    private breakDuration: number;
    private timer: NodeJS.Timeout | null;
    private isSessionActive: boolean;
    private remainingTime: number;
    private callbacks: {
        onStart?: () => void;
        onTick?: (remainingTime: number) => void;
        onPause?: () => void;
        onReset?: () => void;
        onComplete?: () => void;
    };

    constructor(duration?: number, breakDuration?: number) {
        // Duration in minutes
        this.sessionDuration = duration || 25;
        this.breakDuration = breakDuration || 5;
        this.timer = null;
        this.isSessionActive = false;
        this.remainingTime = this.sessionDuration * 60; // Convert to seconds

        this.callbacks = {};
    }

    setCallbacks(callbacks: Partial<Pomo['callbacks']>): void {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    start(): void {
        if (!this.isSessionActive) {
            this.isSessionActive = true;
            this.timer = setInterval(() => this.tick(), 1000);
            if (this.callbacks.onStart) this.callbacks.onStart();
        }
    }

    tick(): void {
        if (this.remainingTime > 0) {
            this.remainingTime--;
            if (this.callbacks.onTick) this.callbacks.onTick(this.remainingTime);
        } else {
            this.completeSession();
        }
    }

    pause(): void {
        if (this.timer) clearInterval(this.timer);
        this.isSessionActive = false;
        if (this.callbacks.onPause) this.callbacks.onPause();
    }

    reset(): void {
        if (this.timer) clearInterval(this.timer);
        this.isSessionActive = false;
        this.remainingTime = this.sessionDuration * 60;
        if (this.callbacks.onReset) this.callbacks.onReset();
    }

    completeSession(): void {
        if (this.timer) clearInterval(this.timer);
        this.isSessionActive = false;
        this.remainingTime = 0;
        if (this.callbacks.onComplete) this.callbacks.onComplete();
    }

    getSessionTime(): number {
        return this.sessionDuration;
    }

    getBreakTime(): number {
        return this.breakDuration;
    }
}

export default Pomo;
