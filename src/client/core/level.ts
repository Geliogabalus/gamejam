import {
  Object3D,
} from 'three';
import type { Actor } from './actors/actor';
import type { Game } from './game';

export class Level {
  private actors: { [key: string]: Actor } = {};

  actorsByObjectUuid: { [key: string]: Actor } = {};

  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  addActor(actor: Actor) {
    this.actors[actor.name] = actor;
    this.actorsByObjectUuid[actor.sceneObject.uuid] = actor;

    if (actor.sceneObject) {
      this.game.scene.add(actor.sceneObject);
    }
  }

  removeActor(actor: Actor) {
    if (actor.sceneObject) {
      this.game.scene.remove(actor.sceneObject);
    }

    delete this.actorsByObjectUuid[actor.sceneObject.uuid];
    delete this.actors[actor.name];
  }

  getActor(name: string): Actor {
    return this.actors[name];
  }

  tick(delta: number) {
    Object.values(this.actors).forEach((actor) => {
      actor.tick(delta);
    });
  }

  public get allObjects(): Object3D[] {
    const result: Object3D[] = [];
    Object.values(this.actors).forEach((actor) => {
      result.push(actor.sceneObject);
    });
    return result;
  }

  public get allActors(): Actor[] {
    const result: Actor[] = [];
    Object.values(this.actors).forEach((actor) => {
      result.push(actor);
    });
    return result;
  }

  addActorToCheckControls(actor: Actor) {
    this.actors[actor.name] = actor;
    this.actorsByObjectUuid[actor.sceneObject.uuid] = actor;
  }

  removeActorToCheckControls(actor: Actor) {
    delete this.actors[actor.name];
    delete this.actorsByObjectUuid[actor.sceneObject.uuid];
  }

  clear() {
    this.game.scene.clear();
    this.actors = {};
    this.actorsByObjectUuid = {};
  }
}
