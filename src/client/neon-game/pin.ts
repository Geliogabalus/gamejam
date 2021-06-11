import { Vector2, Vector3 } from 'three';
import { Actor2D } from '../core/actors/actor-2d';
import { Circle } from './circle';

export class Pin extends Actor2D {
  activeCircle: Circle | null = null;

  attachCircle(circle: Circle) {
    this.activeCircle = circle;
    this.activeCircle.attached = true;

    this.sceneObject.add(circle.sceneObject);
    circle.sceneObject.position.subVectors(circle.sceneObject.position, this.sceneObject.position);
  }

  releaseCircle() {
    if (this.activeCircle) {
      // Существуют аномалии в x = 0
      this.activeCircle.direction.subVectors(
        new Vector2(0, this.activeCircle.sceneObject.position.length() ** 2 / this.activeCircle.sceneObject.position.y),
        new Vector2(this.activeCircle.sceneObject.position.x, this.activeCircle.sceneObject.position.y),
      ).normalize();
      if ((this.activeCircle.sceneObject.position.x > 0 && this.activeCircle.sceneObject.position.y < 0)
          || (this.activeCircle.sceneObject.position.x < 0 && this.activeCircle.sceneObject.position.y > 0)) {
        this.activeCircle.direction.negate();
      }

      const circleWorldPos = new Vector3();
      this.activeCircle.sceneObject.getWorldPosition(circleWorldPos);
      this.game.currentLevel.createActor(this.activeCircle);
      this.activeCircle.sceneObject.position.set(circleWorldPos.x, circleWorldPos.y, circleWorldPos.z);
      this.activeCircle.attached = false;
      this.activeCircle = null;
    }
  }
}
