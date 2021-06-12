import { Vector3 } from 'three';
import { Actor2D } from '../core/actors/actor-2d';
import { Circle } from './circle';
import { Pin } from './pin';

export class Field extends Actor2D {
  onLeftMouseButtonClick(point: Vector3) {
    const pin: Pin = <Pin>(this.game.currentLevel.getActor('pin'));
    if (pin != null) {
      pin.releaseCircle();
      this.game.currentLevel.removeActor(pin);
    } else {
      const newPin: Pin = new Pin('pin', this.game, 'assets/pin.png');
      newPin.sceneObject.scale.x = 1;
      newPin.sceneObject.scale.y = 1;
      newPin.sceneObject.position.set(point.x, point.y, this.sceneObject.position.z);
      this.game.currentLevel.addActor(newPin);

      const circle = <Circle>(this.game.currentLevel.getActor('circle'));
      newPin.attachCircle(circle);
    }
  }
}
