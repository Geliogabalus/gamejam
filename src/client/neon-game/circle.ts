import { Vector2 } from 'three';
import { Actor2D } from '../core/actors/actor-2d';

export class Circle extends Actor2D {
  attached: boolean = false;

  binded: boolean = true;

  clockwise: boolean = false;

  direction: Vector2 = new Vector2(0, 0);

  attach() {
    this.attached = true;
    const cross = this.direction.cross(new Vector2(this.sceneObject.position.x, this.sceneObject.position.y));
    this.clockwise = cross > 0;
  }

  release() {
    // Существуют аномалии в x = 0
    this.direction = new Vector2();
    this.direction.subVectors(
      new Vector2(0, this.sceneObject.position.length() ** 2 / this.sceneObject.position.y),
      new Vector2(this.sceneObject.position.x, this.sceneObject.position.y),
    ).normalize();

    if (this.clockwise) {
      if ((this.sceneObject.position.x > 0 && this.sceneObject.position.y > 0)
        || (this.sceneObject.position.x < 0 && this.sceneObject.position.y < 0)) {
        this.direction.negate();
      }
    } else if ((this.sceneObject.position.x > 0 && this.sceneObject.position.y < 0)
        || (this.sceneObject.position.x < 0 && this.sceneObject.position.y > 0)) {
      this.direction.negate();
    }
    this.attached = false;
    this.binded = false;
  }

  tick(delta: number) {
    const speed = this.game.state.circleSpeed * delta;

    if (this.attached) {
      /* if (this.direction.x === 0 && this.direction.y === 0) {
        this.binded = true;
        this.clockwise = false;
      } */
      let angularSpeed = speed / this.sceneObject.position.length();
      if (this.clockwise) {
        angularSpeed = -angularSpeed;
      }
      const position2D = new Vector2(this.sceneObject.position.x, this.sceneObject.position.y);
      const rotatedPosition = position2D.rotateAround(new Vector2(0, 0), angularSpeed);
      this.sceneObject.position.set(rotatedPosition.x, rotatedPosition.y, this.sceneObject.position.z);
    } else {
      this.sceneObject.translateX(this.direction.x * speed);
      this.sceneObject.translateY(this.direction.y * speed);
    }
  }
}
