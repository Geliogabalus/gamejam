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
    const pin: Pin = <Pin>(this.game.currentLevel.getActor('pin'));
    if (pin == null && !this.game.pinToggled) {
      const newPin: Pin = new Pin('pin', this.game, 'assets/pin.png');
      newPin.sceneObject.scale.x = 1;
      newPin.sceneObject.scale.y = 1;
      newPin.sceneObject.position.set(point.x, point.y, 0);
      this.game.currentLevel.addActor(newPin);

      const circle = <Circle>(this.game.currentLevel.getActor('circle'));
      newPin.attachCircle(circle);

      this.game.pinToggled = false;
    } else {
      this.game.pinToggled = false;
    }
  }
}
