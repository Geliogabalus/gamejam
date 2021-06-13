import { Game } from 'core/game';
import {
  Sprite, SpriteMaterial, TextureLoader, Vector3,
} from 'three';
import { Circle } from '../circle';
import { Pin } from '../pin';
import { Tile, TileType } from '../tile';

export class DefaultTile extends Tile {
  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game, type);
    if (type === TileType.DEFAULT) {
      const loader = new TextureLoader();
      const texture = loader.load(`assets/walls/${code}.png`);
      const material = new SpriteMaterial({ map: texture, alphaTest: 0 });
      this.sceneObject = new Sprite(material);
      this.sceneObject.position.x = this.sceneObject.scale.x / 2;
      this.sceneObject.position.y = -this.sceneObject.scale.y / 2;
      this.objectWrapper.add(this.sceneObject);
    }
  }

  onLeftMouseButtonClick(point: Vector3) {
    this.game.releasePin();
    this.game.placePin(point);
  }
}
