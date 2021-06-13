import {
  Sprite, SpriteMaterial, SpriteMaterialParameters, TextureLoader,
} from 'three';

export enum TileType {
  START,
  DEFAULT,
  WALL,
  STAR,
  FINISH,
}

const loader = new TextureLoader();

const materialMap: { [key in TileType]: SpriteMaterialParameters } = {
  [TileType.STAR]: { color: 0xffd700, map: loader.load('assets/star.png') },
  [TileType.START]: { opacity: 0 },
  [TileType.DEFAULT]: { opacity: 0 },
  [TileType.FINISH]: { color: 0xff0000 },
  [TileType.WALL]: { opacity: 0 },
};

export class Tile {
  sprite: Sprite;

  constructor(public readonly type: TileType) {
    const tileMaterial = new SpriteMaterial(materialMap[type]);
    this.sprite = new Sprite(tileMaterial);
  }
}
