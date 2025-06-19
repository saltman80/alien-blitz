const overlayId = 'game-overlay';

class GameOverlayManager {
  constructor() {
    this.overlay = document.getElementById(overlayId);
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.id = overlayId;
      document.body.appendChild(this.overlay);
    }
    this.overlay.classList.add('game-overlay');
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.display = 'none';
    this.overlay.style.alignItems = 'center';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.background = 'rgba(0, 0, 0, 0.75)';
    this.overlay.style.zIndex = '1000';
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.addEventListener('click', this._handleClick.bind(this));
    this._prevFocus = null;
    this._firstFocusable = null;
    this._lastFocusable = null;
    this._trapHandler = this._handleKeydown.bind(this);
  }

  showScreen(type, data = {}) {
    // save focus
    this._prevFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const templateFn = this.templates[type];
    const html = templateFn
      ? templateFn(data)
      : this.templates.default(type, data);

    this.overlay.innerHTML = html;
    this.overlay.style.display = 'flex';
    this.overlay.setAttribute('aria-hidden', 'false');

    // setup focus trap
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    const focusable = Array.from(this.overlay.querySelectorAll(focusableSelectors.join(',')));
    if (focusable.length) {
      this._firstFocusable = focusable[0];
      this._lastFocusable = focusable[focusable.length - 1];
      this.overlay.addEventListener('keydown', this._trapHandler);
      this._firstFocusable.focus();
    }

    const btn = this.overlay.querySelector('button');
    if (btn) btn.focus();
  }

  hideScreen() {
    this.overlay.innerHTML = '';
    this.overlay.style.display = 'none';
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlay.removeEventListener('keydown', this._trapHandler);
    if (this._prevFocus) {
      this._prevFocus.focus();
      this._prevFocus = null;
    }
  }

  _handleClick(event) {
    const action = event.target.getAttribute('data-action');
    if (!action) return;
    this.hideScreen();
    const customEvent = new CustomEvent('overlayAction', { detail: { action } });
    this.overlay.dispatchEvent(customEvent);
  }

  _handleKeydown(event) {
    if (event.key !== 'Tab') return;
    if (!this._firstFocusable || !this._lastFocusable) return;
    if (event.shiftKey) {
      if (document.activeElement === this._firstFocusable) {
        event.preventDefault();
        this._lastFocusable.focus();
      }
    } else {
      if (document.activeElement === this._lastFocusable) {
        event.preventDefault();
        this._firstFocusable.focus();
      }
    }
  }

  templates = {
    start: () => `
      <div class="overlay-content">
        <h1>Alien Blitz</h1>
        <button data-action="start">Start Game</button>
      </div>
    `,
    gameOver: data => `
      <div class="overlay-content">
        <h1>Game Over</h1>
        <p>Your Score: ${Number(data.score) || 0}</p>
        <button data-action="restart">Play Again</button>
      </div>
    `,
    pause: () => `
      <div class="overlay-content">
        <h1>Paused</h1>
        <button data-action="resume">Resume</button>
        <button data-action="restart">Restart</button>
      </div>
    `,
    levelUp: data => `
      <div class="overlay-content">
        <h1>Level ${Number(data.level) || 0} Complete!</h1>
        <button data-action="continue">Continue</button>
      </div>
    `,
    default: (type, data) => {
      const escapedType = String(type)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      return `
        <div class="overlay-content">
          <p>Unknown screen: ${escapedType}</p>
          <button data-action="close">Close</button>
        </div>
      `;
    }
  }
}

const gameOverlayManager = new GameOverlayManager();
export default gameOverlayManager;