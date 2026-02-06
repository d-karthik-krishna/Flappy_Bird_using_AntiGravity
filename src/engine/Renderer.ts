export class Renderer {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;

    constructor(canvasId: string = 'game-canvas') {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            // Create if not exists
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            document.body.appendChild(this.canvas);
        } else {
            this.canvas = canvas;
        }

        const context = this.canvas.getContext('2d');
        if (!context) throw new Error('Could not get 2D context');
        this.ctx = context;

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.imageSmoothingEnabled = false; // Pixel art style crispness if needed
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // Helper to draw rotated images/shapes
    withTransform(x: number, y: number, rotation: number, scaleX: number, scaleY: number, drawFn: () => void) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.scale(scaleX, scaleY);
        drawFn();
        this.ctx.restore();
    }
}
