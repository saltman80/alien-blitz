import { Projectile } from './projectile.js';

/**
 * Manages the lifecycle of all bullets: creation, updating, drawing, and pruning.
 * Provides access to current bullets for collision checks.
 */
class BulletLifecycleManager {
  constructor() {
    /** @type {Projectile[]} */
    this.bullets = [];
  }

  /**
   * Create and track a new bullet at the given position.
   * @param {number} x
   * @param {number} y
   */
  shoot(x, y, options = {}) {
    this.bullets.push(new Projectile(x, y, options));
  }

  /**
   * Update all bullets and remove those that are no longer alive.
   * @param {number} dt
   */
  updateAll(dt) {
    this.bullets.forEach(bullet => bullet.update(dt));
    this.bullets = this.bullets.filter(bullet => bullet.alive);
  }

  /**
   * Draw all active bullets.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawAll(ctx) {
    this.bullets.forEach(bullet => bullet.draw(ctx));
  }

  /**
   * Remove all bullets immediately.
   */
  clear() {
    this.bullets.length = 0;
  }

  /**
   * Get the current list of active bullets.
   * @returns {Projectile[]}
   */
  getBullets() {
    return this.bullets;
  }
}

const bulletManager = new BulletLifecycleManager();

export function shoot(x, y, options = {}) {
  bulletManager.shoot(x, y, options);
}

export function update(dt) {
  bulletManager.updateAll(dt);
}

export function draw(ctx) {
  bulletManager.drawAll(ctx);
}

export function clear() {
  bulletManager.clear();
}

export function getBullets() {
  return bulletManager.getBullets();
}

export default bulletManager;
