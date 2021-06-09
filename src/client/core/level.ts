import { Scene } from 'three';
// eslint-disable-next-line import/no-cycle
import { Actor } from './actor';

export class Level {
  private scene: Scene;

  private actors: { [key: string]: Actor } = {};

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createActor(actor: Actor) {
    this.actors[actor.name] = actor;

    if (actor.mesh) {
      this.scene.add(actor.mesh);
    }
  }

  destroyActor(actor: Actor) {
    if (actor.mesh) {
      this.scene.remove(actor.mesh);
    }

    delete this.actors[actor.name];
  }

  getActor(name: string): Actor {
    return this.actors[name];
  }

  tick() {
    Object.values(this.actors).forEach((actor) => {
      actor.tick();
    });
  }
}
