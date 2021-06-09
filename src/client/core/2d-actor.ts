import { Sprite, Vector3 } from 'three';
import { Actor } from './actor';
import { Builder } from './builder';
import { Level } from './level';

export class Actor2D extends Actor {
  sceneObject: Sprite;

  constructor(name: string, level: Level, texturePath: string) {
    super(name, level);

    this.sceneObject = Builder.createSprite({ texturePath });
  }

  checkCollision(other: Sprite): boolean {
    const worldPos1 = new Vector3();
    this.sceneObject.getWorldPosition(worldPos1);
    const worldPos2 = new Vector3();
    other.getWorldPosition(worldPos2);

    return worldPos1.x < worldPos2.x + other.scale.x
    && worldPos1.x + this.sceneObject.scale.x > worldPos2.x
    && worldPos1.y < worldPos2.y + other.scale.y
    && worldPos1.y + this.sceneObject.scale.y > worldPos2.y;
  }
}
