import {
  Group, Sprite,
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
  objectWrapper: Group = new Group();

  sprite: Sprite = new Sprite();

  type: TileType

  constructor(name: string, game: Game, type: TileType) {
    super(name, game);
    this.type = type;
  }
}
