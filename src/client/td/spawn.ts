import { Color } from 'three';
import { Actor2D } from '../core/actors/actor-2d';
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
    const minion = new Minion(`minion${Math.random()}`, this.game);
    minion.sceneObject.position.set(
      this.sceneObject.position.x,
      this.sceneObject.position.y - 0.1,
      this.sceneObject.position.z + 0.001,
    );
    this.game.currentLevel.createActor(minion);
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

  onHoverStart() {
    this.sceneObject.material.color = new Color(0xffff00);
  }

  onHoverEnd() {
    this.sceneObject.material.color = new Color(0xffffff);
  }
}
