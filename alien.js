import { Entity } from './entityBaseClass.js';

export default class Alien extends Entity {
  constructor(x, y, config = {}) {
    super(x, y, config.width || 40, config.height || 40);
    this.config = config;
  }

  update(dt) {
    // Custom alien movement could go here
    this.x += (this.config.vx || 0) * dt;
    this.y += (this.config.vy || 0) * dt;
  }

  draw(ctx) {
    ctx.fillStyle = this.config.color || 'lime';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
