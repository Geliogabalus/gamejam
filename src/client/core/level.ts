import { Camera, Raycaster, Scene, Vector2, Vector3 } from 'three';
// eslint-disable-next-line import/no-cycle
import { Actor } from './actor';

export class Level {
  private scene: Scene;
  private camera: Camera;

  private actors: { [key: string]: Actor } = {};

  constructor(scene: Scene, camera: Camera) {
    this.scene = scene;
    this.camera = camera;
  }

  createActor(actor: Actor) {
    this.actors[actor.name] = actor;

    if (actor.sceneObject) {
      this.scene.add(actor.sceneObject);
    }
  }

  destroyActor(actor: Actor) {
    if (actor.sceneObject) {
      this.scene.remove(actor.sceneObject);
    }

    delete this.actors[actor.name];
  }

  getActor(name: string): Actor {
    return this.actors[name];
  }

  getRaycaster(): Raycaster {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(new Vector2(), this.camera);
    return raycaster;
  }

  tick() {
    Object.values(this.actors).forEach((actor) => {
      actor.tick();
    });
  }
}
