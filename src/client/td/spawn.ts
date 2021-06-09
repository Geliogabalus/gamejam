import { Actor2D } from "../core/2d-actor";
import { Minion } from './minion';

export class Spawn extends Actor2D {
  timer: any;

  activated: boolean = false;

  interval: number = 3000;

  activate() {
    this.activated = true;

    setInterval(() => {
      const minion = new Minion(`minion${Math.random()}`, this.level);
      if (minion.sceneObject) {
        minion.sceneObject.position.set(this.sceneObject.position.x, this.sceneObject.position.y - 0.1, this.sceneObject.position.z);
      }
      this.level.createActor(minion);
    }, this.interval);
  }
}
