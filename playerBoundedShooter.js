import { Entity } from './entityBaseClass.js';
import { Projectile } from './projectile.js';

const FIRE_KEYS = ['Space', ' '];

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

class Player extends Entity {
  constructor(game, x, y, options = {}) {
    super(game, x, y, options);
    this.speed = options.speed || 200;
    this.fireRate = options.fireRate || 0.5;
    this.cooldown = 0;
    this.projectileOptions = options.projectileOptions || {};
  }

  update(dt) {
    if (this.input.isKeyDown('ArrowLeft')) {
      this.x -= this.speed * dt;
    }
    if (this.input.isKeyDown('ArrowRight')) {
      this.x += this.speed * dt;
    }

    const half = this.width / 2;
    this.x = clamp(this.x, half, this.game.width - half);

    this.cooldown = Math.max(0, this.cooldown - dt);

    const isFiring = FIRE_KEYS.some(key => this.input.isKeyDown(key));
    if (isFiring && this.cooldown <= 0) {
      this.fire();
      this.cooldown = this.fireRate;
    }
  }

  fire() {
    const proj = new Projectile(
      this.x,
      this.y - this.height / 2,
      this.projectileOptions
    );
    this.game.addEntity(proj);
  }
}

export { Player, clamp };