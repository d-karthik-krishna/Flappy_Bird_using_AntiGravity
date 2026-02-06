export class Vector2 {
    constructor(public x: number = 0, public y: number = 0) {}

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    scale(s: number): Vector2 {
        return new Vector2(this.x * s, this.y * s);
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}
