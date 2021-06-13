import {
  Group,
  Sprite, SpriteMaterial, Texture, TextureLoader,
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

export class Tile extends Actor {
  readonly type: TileType;

  sceneObject: Group = new Group();

  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game);
    this.type = type;
    const loader = new TextureLoader();
    let texture: Texture;
    let material: SpriteMaterial;
    let sprite: Sprite;

    let tileMaterial = new SpriteMaterial({ color: 0xffffff });
    switch (type) {
      case TileType.STAR:
        tileMaterial = new SpriteMaterial({ color: 0xffd700 });
        this.sceneObject.add(new Sprite(tileMaterial));
        break;
      case TileType.START:
        tileMaterial = new SpriteMaterial({ opacity: 0 });
        this.sceneObject.add(new Sprite(tileMaterial));
        break;
      case TileType.FINISH:
        tileMaterial = new SpriteMaterial({ color: 0xff0000 });
        this.sceneObject.add(new Sprite(tileMaterial));
        break;
      case TileType.WALL:
      case TileType.DEFAULT:
        texture = loader.load(`assets/walls/${code}.png`);
        material = new SpriteMaterial({ transparent: true, opacity: 1, map: texture });
        sprite = new Sprite(material);
        sprite.position.x = this.sceneObject.scale.x / 2;
        sprite.position.y = -this.sceneObject.scale.y / 2;
        this.sceneObject.add(sprite);
        break;
      default:
        this.sceneObject.add(new Sprite(tileMaterial));
        break;
    }
  }
}
