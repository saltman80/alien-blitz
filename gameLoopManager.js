import { initKeyStateTracker, teardownKeyStateTracker, isKeyDown } from './keyStateTracker.js';
import CanvasRenderManager from './canvasRenderManager.js';
import { Player } from './playerBoundedShooter.js';
import AlienGridController from './alienGridController.js';
import * as Bullets from './bulletLifecycleManager.js';
import { collides } from './boundingBoxOverlapDetector.js';
import Explosion from './explosion.js';

const BASE_ALIEN_SPEED = 20;
const SPEED_INCREMENT = 10;

let renderer;
let player;
let aliens;
let score = 0;
let lives = 3;
let level = 1;
let lastTime = 0;
let running = false;
let rafId = null;
let canvasWidth = 0;
let canvasHeight = 0;
let explosions = [];

function initGame() {
  const canvas = document.getElementById('game-canvas');
  renderer = new CanvasRenderManager(canvas);
  if (window.gameAssets && window.gameAssets.images.background) {
    renderer.setBackgroundImage(window.gameAssets.images.background);
  }
  const canvasRect = canvas.getBoundingClientRect();
  canvasWidth = canvasRect.width;
  canvasHeight = canvasRect.height;
  player = new Player(
    canvasWidth / 2,
    canvasHeight - 30,
    {
      canvasWidth,
      width: 60,
      height: 30,
      image: window.gameAssets && window.gameAssets.images.playerShip
    }
  );

  aliens = new AlienGridController(
    60,
    60,
    50,
    50,
    {
      width: 40,
      height: 30,
      image: window.gameAssets && window.gameAssets.images.alienBlue,
      speed: BASE_ALIEN_SPEED
    }
  );
  aliens.addAliens(3, 8);
  score = 0;
  lives = 3;
  level = 1;
  explosions = [];
  if (window.gameUI) {
    if (typeof window.gameUI.updateScore === 'function') {
      window.gameUI.updateScore(score);
    }
    if (typeof window.gameUI.updateLives === 'function') {
      window.gameUI.updateLives(lives);
    }
    if (typeof window.gameUI.updateLevel === 'function') {
      window.gameUI.updateLevel(level);
    }
  }
  initKeyStateTracker();
}

function update(dt) {
  player.update(dt);
  Bullets.update(dt);
  aliens.updateAll(dt, canvasWidth);

  // collision detection between bullets and aliens
  const bullets = Bullets.getBullets();
  const alienList = aliens.getAliens();
  for (const alien of alienList) {
    for (const bullet of bullets) {
      if (!alien.alive || !bullet.alive) continue;
      const aBox = { x: alien.x, y: alien.y, x2: alien.x + alien.width, y2: alien.y + alien.height };
      const bBox = {
        x: bullet.x,
        y: bullet.y,
        x2: bullet.x + bullet.width,
        y2: bullet.y + bullet.height
      };
      if (collides(aBox, bBox)) {
        const ex = new Explosion(alien.x + alien.width / 2, alien.y + alien.height / 2, {
          image: window.gameAssets && window.gameAssets.images.explosion,
          width: alien.width,
          height: alien.height
        });
        explosions.push(ex);
        alien.destroy();
        bullet.alive = false;
        score += 10;
        if (window.gameUI && typeof window.gameUI.updateScore === 'function') {
          window.gameUI.updateScore(score);
        }
      }
    }
  }

  explosions.forEach(ex => ex.update(dt));
  explosions = explosions.filter(ex => ex.alive);

  // check for aliens reaching bottom or colliding with player
  const playerBox = {
    x: player.x - player.width / 2,
    y: player.y - player.height / 2,
    x2: player.x + player.width / 2,
    y2: player.y + player.height / 2
  };
  for (const alien of aliens.getAliens()) {
    const aBox = { x: alien.x, y: alien.y, x2: alien.x + alien.width, y2: alien.y + alien.height };
    if (aBox.y2 >= canvasHeight || collides(aBox, playerBox)) {
      handleLifeLost();
      return;
    }
  }

  // advance level if all aliens destroyed
  if (aliens.isEmpty()) {
    level += 1;
    aliens.speed = BASE_ALIEN_SPEED + SPEED_INCREMENT * (level - 1);
    if (window.gameUI && typeof window.gameUI.updateLevel === 'function') {
      window.gameUI.updateLevel(level);
    }
    aliens.addAliens(3, 8);
  }
}

function handleLifeLost() {
  lives = Math.max(0, lives - 1);
  if (window.gameUI && typeof window.gameUI.updateLives === 'function') {
    window.gameUI.updateLives(lives);
  }
  if (lives === 0) {
    if (window.gameUI && typeof window.gameUI.showGameOver === 'function') {
      window.gameUI.showGameOver(score);
    }
    stopGameLoop();
  } else {
    aliens.clear();
    Bullets.clear();
    aliens.addAliens(3, 8);
    player.x = canvasWidth / 2;
    player.y = canvasHeight - 40;
  }
}

function render() {
  const entities = [
    ...aliens.getAliens(),
    ...explosions,
    player,
    ...Bullets.getBullets()
  ];
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
  explosions = [];
  renderer && renderer.destroy();
}
