/**
 * Simple Bullet class definition for use in BulletLifecycleManager.
 */
class Bullet {
  /**
   * @param {number} x - Initial x-coordinate.
   * @param {number} y - Initial y-coordinate.
   * @param {object} [options]
   */
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.speed = 300; // pixels per second
    this.isAlive = true;
    this.image = options.image;
  }

  /**
   * Update bullet position.
   * @param {number} dt - Delta time in seconds.
   */
  update(dt) {
    this.y -= this.speed * dt;
    if (this.y + this.radius < 0) {
      this.isAlive = false;
    }
  }

  /**
   * Draw the bullet on the given context.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.image instanceof HTMLImageElement) {
      ctx.drawImage(
        this.image,
        this.x - this.image.width / 2,
        this.y - this.image.height / 2,
        this.image.width,
        this.image.height
      );
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Manages the lifecycle of all bullets: creation, updating, drawing, and pruning.
 * Provides access to current bullets for collision checks.
 */
class BulletLifecycleManager {
  constructor() {
    /** @type {Bullet[]} */
    this.bullets = [];
  }

  /**
   * Create and track a new bullet at the given position.
   * @param {number} x
   * @param {number} y
   */
  shoot(x, y, options = {}) {
    this.bullets.push(new Bullet(x, y, options));
  }

  /**
   * Update all bullets and remove those that are no longer alive.
   * @param {number} dt
   */
  updateAll(dt) {
    this.bullets.forEach(bullet => bullet.update(dt));
    this.bullets = this.bullets.filter(bullet => bullet.isAlive);
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
   * @returns {Bullet[]}
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
