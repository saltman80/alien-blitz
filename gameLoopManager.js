import { initKeyStateTracker, teardownKeyStateTracker, isKeyDown } from './keyStateTracker.js';
import CanvasRenderManager from './canvasRenderManager.js';
import { Player } from './playerBoundedShooter.js';
import AlienGridController from './alienGridController.js';
import * as Bullets from './bulletLifecycleManager.js';
import { collides } from './boundingBoxOverlapDetector.js';

let renderer;
let player;
let aliens;
let score = 0;
let lastTime = 0;
let running = false;
let rafId = null;

function initGame() {
  const canvas = document.getElementById('game-canvas');
  renderer = new CanvasRenderManager(canvas);
  const canvasRect = canvas.getBoundingClientRect();
  player = new Player(canvasRect.width / 2, canvasRect.height - 40, { canvasWidth: canvasRect.width });
  aliens = new AlienGridController(60, 60, 50, 50, { width: 40, height: 30 });
  aliens.addAliens(3, 8);
  score = 0;
  if (window.gameUI && typeof window.gameUI.updateScore === 'function') {
    window.gameUI.updateScore(score);
  }
  initKeyStateTracker();
}

function update(dt) {
  player.update(dt);
  Bullets.update(dt);
  aliens.updateAll(dt);

  // collision detection between bullets and aliens
  const bullets = Bullets.getBullets();
  const alienList = aliens.getAliens();
  for (const alien of alienList) {
    for (const bullet of bullets) {
      if (!alien.alive || !bullet.isAlive) continue;
      const aBox = { x: alien.x, y: alien.y, x2: alien.x + alien.width, y2: alien.y + alien.height };
      const bBox = { x: bullet.x - bullet.radius, y: bullet.y - bullet.radius, x2: bullet.x + bullet.radius, y2: bullet.y + bullet.radius };
      if (collides(aBox, bBox)) {
        alien.destroy();
        bullet.isAlive = false;
        score += 10;
        if (window.gameUI && typeof window.gameUI.updateScore === 'function') {
          window.gameUI.updateScore(score);
        }
      }
    }
  }
  // prune dead aliens
  aliens.aliens = aliens.getAliens().filter(a => a.alive);
}

function render() {
  const entities = [...aliens.getAliens(), ...Bullets.getBullets(), player];
  renderer.render({ entities, score });
}

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  update(dt);
  render();

  if (running) {
    rafId = requestAnimationFrame(gameLoop);
  }
}

export function startGameLoop() {
  if (running) return;
  initGame();
  running = true;
  lastTime = performance.now();
  rafId = requestAnimationFrame(gameLoop);
}

export function stopGameLoop() {
  running = false;
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  teardownKeyStateTracker();
  Bullets.clear();
  renderer && renderer.destroy();
}
