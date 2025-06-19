import Alien from './alien.js';

export default class AlienGridController {
  constructor(startX, startY, hSpacing, vSpacing, alienConfig) {
    this.startX = startX;
    this.startY = startY;
    this.hSpacing = hSpacing;
    this.vSpacing = vSpacing;
    this.alienConfig = alienConfig;
    this.aliens = [];
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
  updateAll(dt) {
    this.aliens.forEach(alien => alien.update(dt));
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