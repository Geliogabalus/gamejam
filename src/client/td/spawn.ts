import { Actor } from '../core/actor';
import { Minion } from './minion';

export class Spawn extends Actor {
  timer: any;

  activated: boolean = false;

  interval: number = 2000;

  activate() {
    this.activated = true;

    setInterval(() => {
      const minion = new Minion(`minion${Math.random()}`, this.level);
      if (minion.mesh) {
        minion.mesh.position.set(this.mesh.position.x - this.mesh.scale.x, this.mesh.position.y, this.mesh.position.z);
      }
      this.level.createActor(minion);
    }, this.interval);
  }
}
