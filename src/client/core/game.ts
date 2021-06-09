import * as THREE from 'three';
import { Renderer } from 'three';
import { Spawn } from '../td/spawn';
import { Actor2D } from './2d-actor';
import { Actor } from './actor';
import { Level } from './level';
import { MeshHelper } from './mesh-helper';

export interface GameSettings {
  cameraType?: 'perspective' | 'orthographic'
}

export class Game {
  private scene: THREE.Scene;

  private camera: THREE.Camera;

  private level: Level;

  constructor(settings: GameSettings) {
    this.scene = new THREE.Scene();
    this.level = new Level(this.scene);

    switch (settings.cameraType) {
      case 'orthographic':
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        break;
      case 'perspective':
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        break;
      default:
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        break;
    }
  }

  public init() {
    this.camera.position.z = 2;

    const background: Actor2D = new Actor2D('background', this.level, 'assets/grass.jpg');
    background.mesh.scale.x = 6;
    background.mesh.scale.y = 3;
    this.level.createActor(background);

    const portal: Spawn = new Spawn('portal', this.level, 'assets/portal.png');
    portal.mesh.scale.x = 0.5;
    portal.mesh.scale.y = 0.5;
    portal.mesh.translateX(2.7);
    this.level.createActor(portal);

    portal.activate();
  }

  tick(renderer: Renderer) {
    this.level.tick();

    // this.level.getActor('cube').addRotation(new THREE.Vector3(0, 0, 0.5))

    renderer.render(this.scene, this.camera);
  }
}
