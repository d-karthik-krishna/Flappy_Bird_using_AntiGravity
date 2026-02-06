export type UpdateCallback = (deltaTime: number) => void;
export type RenderCallback = () => void;

export class GameLoop {
    private lastTime: number = 0;
    private isRunning: boolean = false;
    private animationFrameId: number = 0;

    constructor(
        private update: UpdateCallback,
        private render: RenderCallback
    ) { }

    start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop(): void {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
    }

    private loop = (time: number): void => {
        if (!this.isRunning) return;

        const deltaTime = Math.min((time - this.lastTime) / 1000, 0.1); // Cap dt at 100ms to prevent huge jumps
        this.lastTime = time;

        this.update(deltaTime);
        this.render();

        this.animationFrameId = requestAnimationFrame(this.loop);
    };
}
