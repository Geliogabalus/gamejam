import {
  Group, Sprite, SpriteMaterial, TextureLoader, Vector2,
} from 'three';
import { Actor } from '../core/actors/actor';
import type { Game } from '../core/game';
import { Tile, TileType } from './tile';

export class Map extends Actor {
  width: number;

  height: number;

  tileMap: Tile[][] = [];

  startTile!: Tile;

  origin: Vector2;

  sceneObject: Group = new Group();

  tileWidth: number;

  tileHeight: number;

  constructor(name: string, game: Game, width: number, height: number, origin: Vector2) {
    super(name, game);
    this.width = width;
    this.height = height;

    // С текущими параметрами размеры 160 на 82 в игровых единицах
    this.tileWidth = 160 / this.width;

    this.tileHeight = 82 / this.height;

    for (let i = 0; i < width; i += 1) {
      this.tileMap.push([]);
    }

    this.sceneObject.position.setX(origin.x);
    this.sceneObject.position.setY(origin.y);
    this.sceneObject.position.setZ(-0.01);
    this.origin = origin;

    this.addBackground();
  }

  addBackground() {
    const material = new SpriteMaterial({ color: '0x000000' });
    const sprite = new Sprite(material);
    sprite.position.x = 0;
    sprite.position.y = 0;
    sprite.scale.x = this.width;
    sprite.scale.y = this.height;
  }

  addWallImage(i: number, j: number, code: string) {
    const loader = new TextureLoader();
    loader.load(`assets/walls/${code}.png`, (texture) => {
      const material = new SpriteMaterial({ transparent: true, opacity: 1, map: texture });
      const sprite = new Sprite(material);
      sprite.position.x = i * this.tileWidth;
      sprite.position.y = -(j * this.tileHeight);
      sprite.scale.x = this.tileWidth;
      sprite.scale.y = this.tileHeight;
      this.sceneObject.add(sprite);
    });
  }

  addTile(i: number, j: number, type: TileType) {
    const tile = new Tile(type);
    this.tileMap[i][j] = tile;
    tile.sprite.position.x = (i * this.tileWidth) + (this.tileWidth / 2);
    tile.sprite.position.y = -((j * this.tileHeight) + (this.tileHeight / 2));
    tile.sprite.scale.x = this.tileWidth;
    tile.sprite.scale.y = this.tileHeight;
    this.sceneObject.add(tile.sprite);

    if (type === TileType.START) {
      this.startTile = tile;
      const constStartPos = this.sceneObject.position.clone();
      constStartPos.setX(constStartPos.x + tile.sprite.position.x);
      constStartPos.setY(constStartPos.y + tile.sprite.position.y);
      this.game.initPinPosition(constStartPos);
    }
  }
}
