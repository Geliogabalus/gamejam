import { Sprite, Vector3 } from 'three';
import { Builder } from '../misc/builder';
import type { Game } from '../game';
import { Actor } from './actor';

export class Actor2D extends Actor {
  sceneObject: Sprite;

  constructor(name: string, game: Game, texturePath: string) {
    super(name, game);

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
