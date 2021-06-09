import { Object3D } from 'three';
// eslint-disable-next-line import/no-cycle
import { Level } from './level';

export class Actor {
  public readonly name: string;

  level: Level;

  sceneObject: THREE.Object3D;

  constructor(name: string, level: Level) {
    this.name = name;
    this.level = level;
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
}
