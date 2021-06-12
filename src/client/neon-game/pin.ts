import { Vector3 } from 'three';
import { Actor2D } from '../core/actors/actor-2d';
import { Circle } from './circle';

export class Pin extends Actor2D {
  activeCircle: Circle | null = null;

  attachCircle(circle: Circle) {
    this.activeCircle = circle;
    this.sceneObject.add(circle.sceneObject);
    circle.sceneObject.position.subVectors(circle.sceneObject.position, this.sceneObject.position);

    this.activeCircle.attach();
  }

  releaseCircle() {
    if (this.activeCircle) {
      this.activeCircle.release();
      const circleWorldPos = new Vector3();
      this.activeCircle.sceneObject.getWorldPosition(circleWorldPos);
      this.activeCircle.sceneObject.position.set(circleWorldPos.x, circleWorldPos.y, circleWorldPos.z);
      this.game.currentLevel.addActor(this.activeCircle);
      this.activeCircle = null;
    }
  }
}
