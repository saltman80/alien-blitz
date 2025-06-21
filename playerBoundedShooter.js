import { Entity } from './entityBaseClass.js';
import bulletManager from './bulletLifecycleManager.js';
import { isKeyDown } from './keyStateTracker.js';

const FIRE_KEYS = ['Space', ' '];

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

class Player extends Entity {
  constructor(x, y, options = {}) {
    super(x, y, options.width || 60, options.height || 30);
    this.speed = options.speed || 200;
    this.fireRate = options.fireRate || 0.5;
    this.cooldown = 0;
    this.canvasWidth = options.canvasWidth || 800;
    this.image = options.image;
  }

  update(dt) {
    if (isKeyDown('ArrowLeft')) {
      this.x -= this.speed * dt;
    }
    if (isKeyDown('ArrowRight')) {
      this.x += this.speed * dt;
    }

    const half = this.width / 2;
    this.x = clamp(this.x, half, this.canvasWidth - half);

    this.cooldown = Math.max(0, this.cooldown - dt);

    const isFiring = FIRE_KEYS.some(key => isKeyDown(key));
    if (isFiring && this.cooldown <= 0) {
      this.fire();
      this.cooldown = this.fireRate;
    }
  }

  draw(ctx) {
    if (this.image instanceof HTMLImageElement) {
      ctx.drawImage(
        this.image,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    } else {
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
      ctx.restore();
    }
  }

  fire() {
    bulletManager.shoot(this.x, this.y - this.height / 2, {
      width: 12,
      height: 36,
      image: window.gameAssets.images.laser
    });
  }
}

export { Player, clamp };
