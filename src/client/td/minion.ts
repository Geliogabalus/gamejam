import { Level } from 'core/level';
import * as THREE from 'three';
import { Sprite, Vector3 } from 'three';
import { Actor2D } from "../core/2d-actor";

export class Minion extends Actor2D {
  constructor(name: string, level: Level) {
    super(name, level, 'assets/monster.png');
    this.sceneObject.scale.x = 0.15;
    this.sceneObject.scale.y = 0.15;
  }

  tick() {
    this.sceneObject.translateX(-0.01);

    const deathpitSprite = this.level.getActor('deathpit').sceneObject;
    if (deathpitSprite instanceof Sprite) {
      if (this.checkCollision(deathpitSprite)) {
        this.level.destroyActor(this);
      }
    }
  }
}
