import { Entity } from './entityBaseClass.js';

export class Projectile extends Entity {
  constructor(x, y, options = {}) {
    const w = options.width || 12;
    const h = options.height || 36;
    super(x - w / 2, y, w, h);
    this.image = options.image;
    this.vy = options.speed || -300;
  }

  update(dt) {
    this.y += this.vy * dt;
    if (this.y + this.height < 0) {
      this.alive = false;
    }
  }

  draw(ctx) {
    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

