import { Entity } from './entityBaseClass.js';

export default class Explosion extends Entity {
  constructor(x, y, options = {}) {
    super(x, y, options.width || 40, options.height || 40);
    this.image = options.image;
    this.timer = options.duration || 0.5;
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.alive = false;
    }
  }

  draw(ctx) {
    if (this.image) {
      ctx.drawImage(
        this.image,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  }
}
