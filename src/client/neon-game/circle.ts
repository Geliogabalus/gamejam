import {
  CircleBufferGeometry,
  Mesh, MeshBasicMaterial, TextureLoader, Vector2, Vector3,
} from 'three';
import { Actor } from '../core/actors/actor';
import { Binding } from './binding';
import type { Game } from '../core/game';

export class Circle extends Actor {
  attached: boolean = false;

  binded: boolean = true;

  clockwise: boolean = false;

  direction: Vector2 = new Vector2(0, 0);

  binding: Binding | null = null;

  radius: number;

  constructor(name: string, game: Game, radius: number) {
    super(name, game);
    this.radius = radius;

    const texture = new TextureLoader().load('assets/circle.png');
    const material: MeshBasicMaterial = new MeshBasicMaterial({
      visible: true,
      map: texture,
      transparent: true,
    });
    const circleMesh: CircleBufferGeometry = new CircleBufferGeometry(this.radius, 10);
    this.sceneObject = new Mesh(circleMesh, material);
  }

  attach() {
    this.attached = true;
    const cross = this.direction.cross(new Vector2(this.sceneObject.position.x, this.sceneObject.position.y));
    this.clockwise = cross > 0;

    const bindingLength = this.sceneObject.position.length();
    this.binding = new Binding('binding', this.game, { length: bindingLength / this.sceneObject.scale.x });
    if (this.sceneObject.position.y > 0) {
      const angle = this.sceneObject.position.angleTo(new Vector3(bindingLength, 0, 0)) + Math.PI;
      this.binding.sceneObject.rotateZ(angle);
    } else {
      const angle = this.sceneObject.position.angleTo(new Vector3(-bindingLength, 0, 0));
      this.binding.sceneObject.rotateZ(angle);
    }
    this.sceneObject.add(this.binding.sceneObject);
  }

  release() {
    if (this.binding) {
      this.sceneObject.remove(this.binding?.sceneObject);
      this.binding = null;
    }

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

    // Перемещение
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
      if (this.binding) {
        this.binding.sceneObject.rotateZ(angularSpeed);
        this.binding.tick(delta);
      }
    } else {
      this.sceneObject.translateX(this.direction.x * speed);
      this.sceneObject.translateY(this.direction.y * speed);
    }

    // Проверка взаимодействий
    const { map } = this.game;
    const worldPosition = new Vector3(); this.sceneObject.getWorldPosition(worldPosition);
    const worldScale = new Vector3(); this.sceneObject.getWorldScale(worldScale);

    const mapPosition = new Vector2();
    mapPosition.x = worldPosition.x - map.origin.x;
    mapPosition.y = worldPosition.y - map.origin.y;

    for (let i = 0; i < map.wallTiles.length - 1; i += 1) {
      const tile = map.wallTiles[i];
      const distX = Math.abs(mapPosition.x - tile.objectWrapper.position.x);
      const distY = Math.abs(mapPosition.y - tile.objectWrapper.position.y);

      if (distX > map.tileWidth + this.radius) continue;
      if (distY > map.tileHeight + this.radius) continue;

      if (distX <= map.tileWidth / 2) {
        this.destroySequence();
        break;
      }
      if (distY <= map.tileHeight / 2) {
        this.destroySequence();
        break;
      }

      const dx = distX - (map.tileWidth / 2);
      const dy = distY - (map.tileHeight / 2);
      if (dx * dx + dy * dy <= this.radius * this.radius) {
        this.destroySequence();
        break;
      }
    }
  }

  destroySequence() {
    this.game.restart()
  }
}
