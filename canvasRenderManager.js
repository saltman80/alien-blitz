export default class CanvasRenderManager {
  constructor(canvasElement) {
    if (!(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error('CanvasRenderManager requires a HTMLCanvasElement');
    }
    this.canvas = canvasElement;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('2D rendering context not supported or canvas unavailable');
    }
    this.ctx = ctx;
    this.backgroundImage = null;
    this._handleResize = this._resizeCanvas.bind(this);
    this._handleResize();
    window.addEventListener('resize', this._handleResize);
  }

  _resizeCanvas() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, width, height);
  }

  setBackgroundImage(img) {
    if (img instanceof HTMLImageElement) {
      this.backgroundImage = img;
    } else {
      this.backgroundImage = null;
    }
  }

  drawEntities(entities) {
    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      if (e && typeof e.draw === 'function') {
        e.draw(this.ctx);
      } else if (e) {
        this._drawFallbackEntity(e);
      }
    }
  }

  _drawFallbackEntity({ x = 0, y = 0, width = 10, height = 10, color = '#f00' } = {}) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }


  render(state) {
    this.clear();
    const { width, height } = this.canvas.getBoundingClientRect();
    if (this.backgroundImage) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, width, height);
    }
    if (state.entities && Array.isArray(state.entities)) {
      this.drawEntities(state.entities);
    }
    // Score and other HUD elements are rendered via the HTML overlay
    // so no on-canvas HUD drawing is required here.
  }

  destroy() {
    window.removeEventListener('resize', this._handleResize);
  }
}