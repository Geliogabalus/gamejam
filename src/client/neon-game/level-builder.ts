import type { Game } from 'core/game';
import { Vector2 } from 'three';
import { Map } from './map';
import { TileType } from './tile';
import { level4, LevelData } from '../data/levels';

const getSquareMap = (map: number[][]) => {
  const newMap: string[][] = [];

  for (let y = 0; y < map.length; y += 1) {
    const newRow: string[] = [];
    for (let x = 0; x < map[0].length; x += 1) {
      // eslint-disable-next-line no-nested-ternary
      newRow.push(`${map[y][x]}${map[y][x + 1] != null ? map[y][x + 1] : '0'}${map[y + 1] != null ? (map[y + 1][x] != null ? map[y + 1][x] : '0') : '0'}${map[y + 1] != null ? (map[y + 1][x + 1] != null ? map[y + 1][x + 1] : '0') : '0'}`);
    }
    newMap.push(newRow);
  }

  return newMap;
};

const addLevelBorders: (level: LevelData) => string[] = (level: LevelData) => [
  `W${[...level[0].split('')].map(() => 'W').join('')}W`,
  ...level.map((row) => `W${row}W`),
  `W${[...level[0].split('')].map(() => 'W').join('')}W`,
];

const letterToTileTypeMap: { [key: string]: TileType } = {
  W: TileType.WALL,
  G: TileType.FINISH,
  C: TileType.STAR,
  S: TileType.START,
  ' ': TileType.DEFAULT,
};

const getWallMap = (level: LevelData) => {
  const wallMap = level
    .map((row) => row
      .split('')
      .map((letter) => (letter === 'W' ? 1 : 0)));

  return getSquareMap(wallMap);
};

export class LevelBuilder {
  static loadMap(mapName: string, game: Game) {
    const level = addLevelBorders(level4);
    const map = new Map('map', game, level[0].length, level.length, new Vector2(-80, 37));
    game.currentLevel.addActor(map);

    const squareMap = getWallMap(level);

    level
      .forEach((row, i) => row.split('')
        .forEach((tile, j) => map
          .addTile(j, i, letterToTileTypeMap[tile] || TileType.DEFAULT, squareMap[i][j])));

    game.map = map;
  }
}
