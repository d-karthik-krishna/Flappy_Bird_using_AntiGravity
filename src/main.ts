import './style.css';
import { Game } from './game/Game';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="game-canvas"></canvas>
`;

// Start game when DOM is ready
window.onload = () => {
  new Game();
};
