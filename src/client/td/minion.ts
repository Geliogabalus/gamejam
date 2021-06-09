import { Level } from 'core/level';
import * as THREE from 'three';
import { Actor2D } from "../core/2d-actor";

export class Minion extends Actor2D {
  constructor(name: string, level: Level) {
    super(name, level, 'assets/monster.png');
    this.mesh.scale.x = 0.15;
    this.mesh.scale.y = 0.15;
  }

  tick() {
    this.mesh.translateX(-0.001);
  }
}
