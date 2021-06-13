import {
  Group, Vector2,
} from 'three';
import { Actor } from '../core/actors/actor';
import type { Game } from '../core/game';
import { Tile, TileType } from './tile';
import { DefaultTile } from './tiles/default-tile';
import { FinishTile } from './tiles/finish-tile';
import { StarTile } from './tiles/star-tile';
import { StartTile } from './tiles/start-tile';
import { WallTile } from './tiles/wall-tile';

export class Map extends Actor {
  width: number;

  height: number;

  tileMap: Tile[][] = [];

  startTile!: Tile;

  origin: Vector2;

  sceneObject: Group = new Group();

  tileWidth: number;

  tileHeight: number;

  wallTiles: Tile[] = [];

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
    let tile: Tile;

    switch (type) {
      case TileType.STAR:
        tile = new StarTile(`tile${Math.random()}`, this.game, type, code);
        break;
      case TileType.START:
        tile = new StartTile(`tile${Math.random()}`, this.game, type, code);
        break;
      case TileType.FINISH:
        tile = new FinishTile(`tile${Math.random()}`, this.game, type, code);
        break;
      case TileType.WALL:
        tile = new WallTile(`tile${Math.random()}`, this.game, type, code);
        break;
      case TileType.DEFAULT:
        tile = new DefaultTile(`tile${Math.random()}`, this.game, type, code);
        break;
      default:
        tile = new DefaultTile(`tile${Math.random()}`, this.game, type, code);
        break;
    }
    this.tileMap[i][j] = tile;
    tile.objectWrapper.position.x = (i * this.tileWidth) + (this.tileWidth / 2);
    tile.objectWrapper.position.y = -((j * this.tileHeight) + (this.tileHeight / 2));
    tile.objectWrapper.scale.x = this.tileWidth;
    tile.objectWrapper.scale.y = this.tileHeight;
    this.sceneObject.add(tile.objectWrapper);
    this.game.currentLevel.addActorToCheckControls(tile);

    // const plane = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ wireframe: true, color: 0xff0000 }));
    // tile.sceneObject.add(plane);

    if (type === TileType.WALL) {
      this.wallTiles.push(tile);
    }

    if (type === TileType.START) {
      this.startTile = tile;
      const constStartPos = this.sceneObject.position.clone();
      constStartPos.setX(constStartPos.x + tile.objectWrapper.position.x);
      constStartPos.setY(constStartPos.y + tile.objectWrapper.position.y);
      this.game.startPosition = new Vector2(constStartPos.x, constStartPos.y);
      this.game.initPinPosition();
    }
  }
}
