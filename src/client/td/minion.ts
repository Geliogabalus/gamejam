import { Level } from 'core/level';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { Actor2D } from "../core/2d-actor";

export class Minion extends Actor2D {
  constructor(name: string, level: Level) {
    super(name, level, 'assets/monster.png');
    this.sceneObject.scale.x = 0.15;
    this.sceneObject.scale.y = 0.15;
  }

  tick() {
    this.sceneObject.translateX(-0.01);

    const raycaster = this.level.getRaycaster();
    const deathpit = this.level.getActor('deathpit');
    raycaster.set(this.sceneObject.position, new Vector3().subVectors(this.sceneObject.position, deathpit.sceneObject.position).normalize())
    let intersects = raycaster.intersectObjects([deathpit.sceneObject], false);
    if (intersects.length > 0) {
      if (intersects[0].distance < this.sceneObject.scale.x) {
        this.level.destroyActor(this);
      }
    }
  }
}
