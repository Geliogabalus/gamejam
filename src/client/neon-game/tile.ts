import {
  Group,
  Sprite,
  SpriteMaterial,
  SpriteMaterialParameters,
  TextureLoader,
} from 'three';
import { Actor } from '../core/actors/actor';
import type { Game } from '../core/game';

export enum TileType {
  START = 1,
  DEFAULT = 2,
  WALL = 3,
  STAR = 4,
  FINISH = 5,
}

const loader = new TextureLoader();

const materialMap: Partial<{ [key in TileType]: SpriteMaterialParameters }> = {
  [TileType.STAR]: { color: 0xffd700, map: loader.load('assets/star.png') },
  [TileType.START]: { opacity: 0 },
  [TileType.FINISH]: { color: 0xff0000 },
};

export class Tile extends Actor {
  sceneObject: Group = new Group();

  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game);

    if (type === TileType.WALL || type === TileType.DEFAULT) {
      const texture = loader.load(`assets/walls/${code}.png`);
      const material = new SpriteMaterial({ transparent: true, opacity: 1, map: texture });
      const sprite = new Sprite(material);
      sprite.position.x = this.sceneObject.scale.x / 2;
      sprite.position.y = -this.sceneObject.scale.y / 2;
      this.sceneObject.add(sprite);
      return;
    }

    const material = new SpriteMaterial(materialMap[type]);
    const sprite = new Sprite(material);
    this.sceneObject.add(sprite);
  }
}
