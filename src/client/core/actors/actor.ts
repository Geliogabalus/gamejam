import { Object3D, Vector3 } from 'three';
import type { Game } from '../game';

export class Actor {
  public readonly name: string;

  isHovered: boolean = false;

  game: Game;

  sceneObject: THREE.Object3D;

  constructor(name: string, game: Game) {
    this.name = name;
    this.game = game;
    this.sceneObject = new Object3D();
  }

  addRotation(rotation: THREE.Vector3) {
    if (this.sceneObject) {
      this.sceneObject.rotation.x += rotation.x;
      this.sceneObject.rotation.y += rotation.y;
      this.sceneObject.rotation.y += rotation.y;
    }
  }

  translate(translate: THREE.Vector3) {
    if (this.sceneObject) {
      this.sceneObject.translateX(translate.x);
      this.sceneObject.translateZ(translate.y);
      this.sceneObject.translateY(translate.z);
    }
  }

  setScale(scale: THREE.Vector3) {
    if (this.sceneObject) {
      this.sceneObject.scale.set(scale.x, scale.y, scale.z);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(delta: number) { }

  public setHovered(v: boolean) {
    this.isHovered = v;
  }

  onHoverStart() {}

  onHoverEnd() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLeftMouseButtonClick(point: Vector3) {}
}
