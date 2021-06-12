import type { Game } from 'core/game';
import { Color, TextureLoader, Vector2 } from 'three';
import { Map } from './map';
import { TileType } from './tile';

export class LevelBuilder {
  static loadMap(mapName: string, game: Game) {
    const loader = new TextureLoader();
    loader.load(`assets/maps/${mapName}`, (texture) => {
      const { image } = texture;
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext('2d');
      context?.drawImage(image, 0, 0);
      const mapData = context?.getImageData(0, 0, image.width, image.height);

      const wallColor = new Color(0, 0, 0);
      const defaultColor = new Color(255, 255, 255);
      const starColor = new Color(255, 242, 0);
      const finishColor = new Color(63, 72, 204);
      const startColor = new Color(237, 28, 36);

      if (mapData) {
        // С поправкой на один тайл внешней границы
        const map = new Map('map', game, 82, 42, new Vector2(-80, 37));
        game.currentLevel.addActor(map);

        for (let i = 0; i < 82; i += 1) {
          for (let j = 0; j < 42; j += 1) {
            if (i === 0 || j === 0 || i === 81 || j === 41) {
              map.addTile(i, j, TileType.WALL);
            } else {
              const color = this.getPixel(mapData, i - 1, j - 1);
              if (color.equals(wallColor)) {
                map.addTile(i, j, TileType.WALL);
              }
              if (color.equals(defaultColor)) {
                map.addTile(i, j, TileType.DEFAULT);
              }
              if (color.equals(starColor)) {
                map.addTile(i, j, TileType.STAR);
              }
              if (color.equals(finishColor)) {
                map.addTile(i, j, TileType.FINISH);
              }
              if (color.equals(startColor)) {
                map.addTile(i, j, TileType.START);
              }
            }
          }
        }

        game.map = map;
      }
    });
  }

  static getPixel(imagedata: ImageData, x: number, y: number): Color {
    const position = (x + imagedata.width * y) * 4;
    const { data } = imagedata;
    return new Color(data[position], data[position + 1], data[position + 2]);
  }
}
