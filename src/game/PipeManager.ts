import { Renderer } from '../engine/Renderer';

export interface Pipe {
    x: number;
    topHeight: number; // Height of top pipe
    bottomY: number;   // Y start of bottom pipe
    width: number;
    passed: boolean;
}

export class PipeManager {
    public pipes: Pipe[] = [];
    public speed: number = 200;
    public spawnTimer: number = 0;

    private readonly SPAWN_INTERVAL = 1.8; // Seconds
    private readonly PIPE_WIDTH = 60;
    private readonly PIPE_GAP = 180;
    private readonly MIN_PIPE_HEIGHT = 50;

    constructor() { }

    update(dt: number, gameHeight: number): void {
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.SPAWN_INTERVAL) {
            this.spawnPipe(gameHeight);
            this.spawnTimer = 0;
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.speed * dt;

            // Remove if off screen
            if (pipe.x + pipe.width < -100) {
                this.pipes.splice(i, 1);
            }
        }

        // Incrase speed slightly over time?
        // this.speed += dt * 1; 
    }

    spawnPipe(gameHeight: number): void {
        // Calculate random height
        // Available space for top pipe: gameHeight - gap - min_bottom
        const maxTop = gameHeight - this.PIPE_GAP - this.MIN_PIPE_HEIGHT;
        const topHeight = Math.random() * (maxTop - this.MIN_PIPE_HEIGHT) + this.MIN_PIPE_HEIGHT;

        this.pipes.push({
            x: window.innerWidth + 50, // Spawn just outside
            topHeight: topHeight,
            bottomY: topHeight + this.PIPE_GAP,
            width: this.PIPE_WIDTH,
            passed: false
        });
    }

    draw(renderer: Renderer): void {
        renderer.ctx.fillStyle = '#75DA8B'; // Classic green or maybe modern neon?
        // Let's go with a modern nice green
        const ctx = renderer.ctx;

        for (const pipe of this.pipes) {
            // Draw Top Pipe
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);

            // Draw Cap for top
            ctx.fillStyle = '#5AC572'; // Darker/Lighter cap
            ctx.fillRect(pipe.x - 2, pipe.topHeight - 20, pipe.width + 4, 20);
            ctx.fillStyle = '#75DA8B';

            // Draw Bottom Pipe
            ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, renderer.height - pipe.bottomY);

            // Draw Cap for bottom
            ctx.fillStyle = '#5AC572';
            ctx.fillRect(pipe.x - 2, pipe.bottomY, pipe.width + 4, 20);
            ctx.fillStyle = '#75DA8B';
        }
    }

    reset(): void {
        this.pipes = [];
        this.spawnTimer = 0;
        this.speed = 200;
    }
}
