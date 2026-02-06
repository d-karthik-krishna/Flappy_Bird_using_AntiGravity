import { Vector2 } from '../engine/Vector2';
import { Renderer } from '../engine/Renderer';

export class Bird {
    public position: Vector2;
    public velocity: Vector2;
    public radius: number = 20;
    public rotation: number = 0;

    private readonly GRAVITY = 2000;
    private readonly FLAP_FORCE = -500;
    private readonly MAX_ROTATION = Math.PI / 4;
    private readonly MIN_ROTATION = -Math.PI / 4;

    constructor(x: number, y: number) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
    }

    flap(): void {
        this.velocity.y = this.FLAP_FORCE;
        // Reset rotation a bit upwards on flap
        this.rotation = -Math.PI / 4;
    }

    update(dt: number): void {
        this.velocity.y += this.GRAVITY * dt;
        this.position.y += this.velocity.y * dt;

        // Rotation logic: 
        // Map velocity to rotation
        this.rotation = Math.min(this.MAX_ROTATION, Math.max(this.MIN_ROTATION, (this.velocity.y * 0.002)));
    }

    draw(renderer: Renderer): void {
        renderer.withTransform(this.position.x, this.position.y, this.rotation, 1, 1, () => {
            // Body
            renderer.ctx.fillStyle = '#FFD700'; // Gold/Yellow
            renderer.ctx.beginPath();
            renderer.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            renderer.ctx.fill();

            // Eye
            renderer.ctx.fillStyle = '#FFFFFF';
            renderer.ctx.beginPath();
            renderer.ctx.arc(8, -8, 8, 0, Math.PI * 2);
            renderer.ctx.fill();

            // Pupil
            renderer.ctx.fillStyle = '#000000';
            renderer.ctx.beginPath();
            renderer.ctx.arc(10, -8, 3, 0, Math.PI * 2);
            renderer.ctx.fill();

            // Wing (Visual only, animates separately maybe?)
            renderer.ctx.fillStyle = '#FFFFFF';
            renderer.ctx.beginPath();
            renderer.ctx.ellipse(-5, 5, 12, 8, 0, 0, Math.PI * 2);
            renderer.ctx.fill();

            // Beak
            renderer.ctx.fillStyle = '#FF4500'; // Orange
            renderer.ctx.beginPath();
            renderer.ctx.moveTo(10, 0);
            renderer.ctx.lineTo(25, 5);
            renderer.ctx.lineTo(10, 10);
            renderer.ctx.fill();
        });
    }

    reset(x: number, y: number): void {
        this.position.set(x, y);
        this.velocity.set(0, 0);
        this.rotation = 0;
    }
}
