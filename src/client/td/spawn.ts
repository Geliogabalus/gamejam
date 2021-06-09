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
      if (minion.mesh) {
        minion.mesh.position.set(this.mesh.position.x, this.mesh.position.y - 0.1, this.mesh.position.z);
      }
      this.level.createActor(minion);
    }, this.interval);
  }
}
