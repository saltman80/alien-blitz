import gameOverlayManager from './gameOverlayManager.js';
import { startGameLoop, stopGameLoop } from './gameLoopManager.js';
import bootstrapApp from './bootstrapAppStart.js';

window.gameUI = {
  init: (cb) => {
    gameOverlayManager.showScreen('start');
    if (typeof cb === 'function') cb();
  },
  showError: (err) => {
    alert('Error: ' + (err && err.message ? err.message : err));
  },
  updateScore: (score) => {
    const el = document.getElementById('score');
    if (el) el.textContent = score;
  },
  updateLives: (lives) => {
    const el = document.getElementById('lives');
    if (el) el.textContent = lives;
  },
  updateLevel: (level) => {
    const el = document.getElementById('level');
    if (el) el.textContent = level;
  },
  showGameOver: (score) => {
    gameOverlayManager.showScreen('gameOver', { score });
  }
};

window.gameEngine = {
  init: () => {
    return Promise.resolve();
  }
};

window.game = {
  start: startGameLoop,
  restart: () => {
    stopGameLoop();
    startGameLoop();
  }
};

gameOverlayManager.overlay.addEventListener('overlayAction', (e) => {
  const action = e.detail && e.detail.action;
  if (action === 'start') {
    window.game.start();
  } else if (action === 'restart') {
    window.game.restart();
  }
});

bootstrapApp();
