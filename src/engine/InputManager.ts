export class InputManager {
    private keys: Set<string> = new Set();
    private previousKeys: Set<string> = new Set();
    private touchActive: boolean = false;
    private previousTouchActive: boolean = false;

    // Configurable binding
    public jumpKeys: string[] = ['Space', 'ArrowUp', 'KeyW'];

    constructor() {
        this.init();
    }

    private init(): void {
        window.addEventListener('keydown', (e) => this.keys.add(e.code));
        window.addEventListener('keyup', (e) => this.keys.delete(e.code));

        window.addEventListener('mousedown', () => this.touchActive = true);
        window.addEventListener('mouseup', () => this.touchActive = false);

        window.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            this.touchActive = true;
        }, { passive: false });

        window.addEventListener('touchend', () => this.touchActive = false);
    }

    update(): void {
        this.previousKeys = new Set(this.keys);
        this.previousTouchActive = this.touchActive;
        this.updateGamepad();
    }

    isJumpPressed(): boolean {
        // Keyboard
        for (const code of this.jumpKeys) {
            if (this.keys.has(code) && !this.previousKeys.has(code)) {
                return true;
            }
        }

        // Touch / Mouse (just check if it started this frame)
        if (this.touchActive && !this.previousTouchActive) {
            return true;
        }

        // Gamepad (A button / Cross)
        const gamepad = navigator.getGamepads()[0];
        if (gamepad) {
            // Simple check for button 0 (A/Cross) being pressed now but separate state tracking would be better
            // For now, this might fire continuously if held, so we'd need state tracking for gamepad too.
            // Let's hold off complex gamepad state for a sec or add it if needed.
            // Actually, for "flap" we need single impulse.
            if (gamepad.buttons[0].pressed && !this.lastGamepadButtonState) {
                this.lastGamepadButtonState = true;
                return true;
            }
            if (!gamepad.buttons[0].pressed) {
                this.lastGamepadButtonState = false;
            }
        }

        return false;
    }

    private lastGamepadButtonState: boolean = false;
    private updateGamepad(): void {
        // Gamepad polling is per-frame in `isJumpPressed` effectively or here.
    }
}
