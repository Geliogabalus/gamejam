import { Sprite, SpriteMaterial } from 'three';
import { Actor } from './actor';
import { Builder } from './builder';
import { Level } from './level';

export class Actor2D extends Actor {
  sceneObject: Sprite;

  constructor(name: string, level: Level, texturePath: string) {
    super(name, level);

    this.sceneObject = Builder.createSprite({ texturePath: texturePath });
  }
}
