import { Sprite, SpriteMaterial } from 'three';

export enum TileType {
  START,
  DEFAULT,
  WALL,
  STAR,
  FINISH,
}

export class Tile {
  readonly type: TileType;

  sprite: Sprite;

  constructor(type: TileType) {
    this.type = type;

    let tileMaterial = new SpriteMaterial({ color: 0xffffff });
    switch (type) {
      case TileType.STAR:
        tileMaterial = new SpriteMaterial({ color: 0xffd700 });
        break;
      case TileType.START:
      case TileType.DEFAULT:
        tileMaterial = new SpriteMaterial({ color: 0x333333 });
        break;
      case TileType.FINISH:
        tileMaterial = new SpriteMaterial({ color: 0xff0000 });
        break;
      case TileType.WALL:
        tileMaterial = new SpriteMaterial({ color: 0x440bd4 });
        break;
      default:
        break;
    }

    this.sprite = new Sprite(tileMaterial);
  }
}
