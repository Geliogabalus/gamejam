import { Actor2D } from '../core/2d-actor';
import { Minion } from './minion';

export class Spawn extends Actor2D {
  timer: any;

  activated: boolean = false;

  interval: number = 3000;

  currentSpan: number = 0;

  activate() {
    this.activated = true;
  }

  spawn() {
    const minion = new Minion(`minion${Math.random()}`, this.level);
    minion.sceneObject.position.set(this.sceneObject.position.x, this.sceneObject.position.y - 0.1, this.sceneObject.position.z);
    this.level.createActor(minion);
  }

  tick(delta: number) {
    if (this.activated) {
      this.currentSpan += delta * 1000;
      if (this.currentSpan > this.interval) {
        this.spawn();
        this.currentSpan = 0;
      }
    }
  }
}
