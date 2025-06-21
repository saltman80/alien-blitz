import Alien from './alien.js';

export default class AlienGridController {
  constructor(startX, startY, hSpacing, vSpacing, alienConfig) {
    this.startX = startX;
    this.startY = startY;
    this.hSpacing = hSpacing;
    this.vSpacing = vSpacing;
    this.alienConfig = alienConfig;
    this.aliens = [];
    this.direction = 1;
    this.speed = alienConfig.speed || 20;
  }

  addAliens(rows, cols) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = this.startX + col * this.hSpacing;
        const y = this.startY + row * this.vSpacing;
        const alien = new Alien(x, y, this.alienConfig);
        this.aliens.push(alien);
      }
    }
  }

  /**
   * Updates all aliens, removing any that are destroyed.
   * @param {number} dt Delta time since last update (in seconds).
   */
  updateAll(dt, canvasWidth) {
    const xs = this.aliens.map(a => a.x);
    const rights = this.aliens.map(a => a.x + a.width);
    const minX = Math.min(...xs);
    const maxX = Math.max(...rights);

    const step = this.direction * this.speed * dt;
    if (minX + step < 0 || maxX + step > canvasWidth) {
      this.direction *= -1;
      this.aliens.forEach(alien => {
        alien.y += this.vSpacing / 2;
      });
    }

    this.aliens.forEach(alien => {
      alien.x += this.direction * this.speed * dt;
      alien.update(dt);
    });

    this.aliens = this.aliens.filter(alien => alien.alive);
  }

  /**
   * Draws all active aliens to the provided canvas context.
   * @param {CanvasRenderingContext2D} ctx Canvas 2D rendering context.
   */
  drawAll(ctx) {
    this.aliens.forEach(alien => alien.draw(ctx));
  }

  /**
   * Removes all aliens from the grid.
   */
  clear() {
    this.aliens.length = 0;
  }

  /**
   * Checks if there are no remaining aliens.
   * @returns {boolean} True if all aliens have been destroyed or none spawned.
   */
  isEmpty() {
    return this.aliens.length === 0;
  }

  /**
   * Retrieves the array of current aliens.
   * @returns {Alien[]} Array of alien instances.
   */
  getAliens() {
    return this.aliens;
  }
}
