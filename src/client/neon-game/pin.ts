import { Actor } from '../core/actors/actor';
import { Game } from 'core/game';
import { CircleBufferGeometry, Mesh, MeshBasicMaterial, TextureLoader, Vector3 } from 'three';
import type { Circle } from './circle';

export class Pin extends Actor {
  activeCircle: Circle | null = null;

  radius: number;

  constructor(name: string, game: Game, radius: number) {
    super(name, game);
    this.radius = radius;

    const texture = new TextureLoader().load('assets/pin.png');
    const material: MeshBasicMaterial = new MeshBasicMaterial({
      visible: true,
      map: texture,
      transparent: true,
    });
    const circleMesh: CircleBufferGeometry = new CircleBufferGeometry(this.radius, 10);
    this.sceneObject = new Mesh(circleMesh, material);
  }

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
