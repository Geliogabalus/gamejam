import {
  Sprite, SpriteMaterial, Texture, TextureLoader,
} from 'three';
import { Actor } from '../core/actors/actor';
import type { Game } from '../core/game';

export enum TileType {
  START,
  DEFAULT,
  WALL,
  STAR,
  FINISH,
}

export class Tile extends Actor {
  readonly type: TileType;

  sceneObject: Sprite;

  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game);
    this.type = type;
    const loader = new TextureLoader();
    let texture: Texture;
    let material: SpriteMaterial;

    let tileMaterial = new SpriteMaterial({ color: 0xffffff });
    switch (type) {
      case TileType.STAR:
        tileMaterial = new SpriteMaterial({ color: 0xffd700 });
        this.sceneObject = new Sprite(tileMaterial);
        break;
      case TileType.START:
        tileMaterial = new SpriteMaterial({ opacity: 0 });
        this.sceneObject = new Sprite(tileMaterial);
        break;
      case TileType.FINISH:
        tileMaterial = new SpriteMaterial({ color: 0xff0000 });
        this.sceneObject = new Sprite(tileMaterial);
        break;
      case TileType.WALL:
      case TileType.DEFAULT:
        texture = loader.load(`assets/walls/${code}.png`);
        material = new SpriteMaterial({ transparent: true, opacity: 1, map: texture });
        this.sceneObject = new Sprite(material);
        break;
      default:
        this.sceneObject = new Sprite(tileMaterial);
        break;
    }
  }
}
