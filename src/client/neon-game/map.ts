import { Group, Vector2 } from 'three';
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
  }

  addTile(i: number, j: number, type: TileType, code: string) {
    const tile = new Tile(`tile${Math.random()}`, this.game, type, code);
    this.tileMap[i][j] = tile;
    tile.sceneObject.position.x = (i * this.tileWidth) + (this.tileWidth / 2);
    tile.sceneObject.position.y = -((j * this.tileHeight) + (this.tileHeight / 2));
    tile.sceneObject.scale.x = this.tileWidth;
    tile.sceneObject.scale.y = this.tileHeight;
    this.sceneObject.add(tile.sceneObject);

    if (type === TileType.START) {
      this.startTile = tile;
      const constStartPos = this.sceneObject.position.clone();
      constStartPos.setX(constStartPos.x + tile.sceneObject.position.x);
      constStartPos.setY(constStartPos.y + tile.sceneObject.position.y);
      this.game.initPinPosition(constStartPos);
    }
  }
}
