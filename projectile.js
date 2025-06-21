import { Entity } from './entityBaseClass.js';

export class Projectile extends Entity {
  constructor(x, y, options = {}) {
    super(x, y, options.width || 4, options.height || 10);
    this.vy = options.speed || -300;
    this.image = options.image;
    this.config = options;
  }

  update(dt) {
    this.y += this.vy * dt;
    if (this.y + this.height < 0) {
      this.alive = false;
    }
  }

  draw(ctx) {
    if (this.image) {
      ctx.drawImage(
        this.image,
        this.x - this.width / 2,
        this.y,
        this.width,
        this.height
      );
    } else {
      ctx.fillStyle = this.config.color || 'white';
      ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
    }
  }
}

