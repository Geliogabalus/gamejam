import { Actor } from './actor';
import { Level } from './level';
import { MeshHelper } from './mesh-helper';

export class Actor2D extends Actor {
  constructor(name: string, level: Level, texturePath: string) {
    super(name, level);

    this.mesh = MeshHelper.createPlane({ texturePath: texturePath });
  }
}
