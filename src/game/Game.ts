import { GameLoop } from '../engine/GameLoop';
import { Renderer } from '../engine/Renderer';
import { InputManager } from '../engine/InputManager';
import { AudioManager } from '../engine/AudioManager';
import { Bird } from './Bird';
import { PipeManager } from './PipeManager';
import { ParticleSystem } from './ParticleSystem';

const enum GameState {
    MENU,
    PLAYING,
    GAMEOVER
}

export class Game {
    private loop: GameLoop;
    private renderer: Renderer;
    private input: InputManager;
    private audio: AudioManager;

    private bird: Bird;
    private pipes: PipeManager;
    private particles: ParticleSystem;

    private state: GameState = GameState.MENU;
    private score: number = 0;
    private highScore: number = 0;

    constructor() {
        this.renderer = new Renderer();
        this.input = new InputManager();
        this.audio = new AudioManager();
        this.pipes = new PipeManager();
        this.bird = new Bird(100, this.renderer.height / 2);
        this.particles = new ParticleSystem();

        this.loop = new GameLoop(
            (dt) => this.update(dt),
            () => this.render()
        );

        // Load high score
        const saved = localStorage.getItem('fb_highscore');
        if (saved) this.highScore = parseInt(saved, 10);

        this.loop.start();
    }

    private update(dt: number): void {


        switch (this.state) {
            case GameState.MENU:
                // Hover bird slightly
                this.bird.position.y = this.renderer.height / 2 + Math.sin(Date.now() / 300) * 10;
                this.bird.rotation = 0;

                if (this.input.isJumpPressed()) {
                    this.startGame();
                }
                break;

            case GameState.PLAYING:
                if (this.input.isJumpPressed()) {
                    this.bird.flap();
                    this.audio.playJump();
                }

                this.bird.update(dt);
                this.pipes.update(dt, this.renderer.height);
                this.particles.update(dt);

                this.checkCollisions();
                break;

            case GameState.GAMEOVER:
                if (this.input.isJumpPressed()) {
                    this.resetGame();
                }
                break;
        }

        this.input.update();
    }

    private startGame(): void {
        this.state = GameState.PLAYING;
        this.score = 0;
        this.bird.reset(100, this.renderer.height / 2);
        this.pipes.reset();
        this.bird.flap(); // Initial jump
    }

    private resetGame(): void {
        this.state = GameState.MENU;
        this.bird.reset(100, this.renderer.height / 2);
        this.pipes.reset();
    }

    private checkCollisions(): void {
        // Floor/Ceiling
        if (this.bird.position.y + this.bird.radius > this.renderer.height || this.bird.position.y - this.bird.radius < 0) {
            this.die();
        }

        // Pipes
        const birdLeft = this.bird.position.x - this.bird.radius;
        const birdRight = this.bird.position.x + this.bird.radius;
        const birdTop = this.bird.position.y - this.bird.radius;
        const birdBottom = this.bird.position.y + this.bird.radius;

        for (const pipe of this.pipes.pipes) {
            // Horizontal overlap
            if (birdRight > pipe.x && birdLeft < pipe.x + pipe.width) {
                // Vertical check (hit top or bottom pipe)
                if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
                    this.die();
                }
            }

            // Score counting
            if (!pipe.passed && birdLeft > pipe.x + pipe.width) {
                pipe.passed = true;
                this.score++;
                this.audio.playScore();
                this.particles.emit(pipe.x + pipe.width / 2, pipe.topHeight + 90, 15, '#FFD700'); // Sparkle in gap
                // Speed up slightly
                this.pipes.speed += 5;
            }
        }
    }

    private die(): void {
        this.state = GameState.GAMEOVER;
        this.audio.playCrash();
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('fb_highscore', this.highScore.toString());
        }
    }

    private render(): void {
        this.renderer.clear();

        // Background (simple gradient for now)
        const ctx = this.renderer.ctx;
        const grad = ctx.createLinearGradient(0, 0, 0, this.renderer.height);
        grad.addColorStop(0, '#87CEEB'); // Sky blue
        grad.addColorStop(1, '#E0F7FA');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.renderer.width, this.renderer.height);

        this.pipes.draw(this.renderer);
        this.bird.draw(this.renderer);
        this.particles.draw(this.renderer);

        // UI Layer
        this.renderUI(ctx);
    }

    private renderUI(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = 'bold 30px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';

        if (this.state === GameState.MENU) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, 0, this.renderer.width, this.renderer.height);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 40px "Segoe UI"';
            ctx.strokeText("FLAPPY BIRD", this.renderer.width / 2, this.renderer.height / 3);
            ctx.fillText("FLAPPY BIRD", this.renderer.width / 2, this.renderer.height / 3);

            ctx.font = '20px "Segoe UI"';
            ctx.fillText("Tap / Space to Flap", this.renderer.width / 2, this.renderer.height / 2);
        }
        else if (this.state === GameState.PLAYING) {
            ctx.font = 'bold 50px "Segoe UI"';
            ctx.strokeText(this.score.toString(), this.renderer.width / 2, 80);
            ctx.fillText(this.score.toString(), this.renderer.width / 2, 80);
        }
        else if (this.state === GameState.GAMEOVER) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, this.renderer.width, this.renderer.height);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 40px "Segoe UI"';
            ctx.strokeText("GAME OVER", this.renderer.width / 2, this.renderer.height / 3);
            ctx.fillText("GAME OVER", this.renderer.width / 2, this.renderer.height / 3);

            ctx.font = '30px "Segoe UI"';
            ctx.fillText(`Score: ${this.score}`, this.renderer.width / 2, this.renderer.height / 2);
            ctx.fillText(`Best: ${this.highScore}`, this.renderer.width / 2, this.renderer.height / 2 + 50);

            ctx.font = '20px "Segoe UI"';
            ctx.fillText("Tap to Retry", this.renderer.width / 2, this.renderer.height / 2 + 120);
        }
    }
}
