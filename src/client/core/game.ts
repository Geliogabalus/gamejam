import { Deathpit } from '../td/deathpit';
import * as THREE from 'three';
import { OrthographicCamera, Renderer } from 'three';
import { Spawn } from '../td/spawn';
import { Actor2D } from './2d-actor';
import { Actor } from './actor';
import { Level } from './level';

export interface GameSettings {
  cameraType?: 'perspective' | 'orthographic',
  renderer: Renderer
}

export class Game {
  private scene: THREE.Scene;

  private camera: THREE.Camera;

  private level: Level;

  readonly viewSize = 3;

  renderer: Renderer;

  constructor(settings: GameSettings) {
    let aspectRatio = window.innerWidth / window.innerHeight;
    switch (settings.cameraType) {
      case 'orthographic':
        this.camera = new THREE.OrthographicCamera(-aspectRatio * this.viewSize / 2, aspectRatio * this.viewSize / 2, this.viewSize / 2, -this.viewSize / 2, 0.1, 1000);
        break;
      case 'perspective':
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        break;
      default:
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        break;
    }
    this.renderer = settings.renderer;
    this.scene = new THREE.Scene();
    this.level = new Level(this.scene, this.camera);
    
    let onWindowResize = () => {
      let aspect = window.innerWidth / window.innerHeight;
      
      if (this.camera instanceof OrthographicCamera) {
        this.camera.left = -aspect * this.viewSize / 2
        this.camera.right = aspect * this.viewSize / 2
        this.camera.updateProjectionMatrix();
      }
  
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener( 'resize', onWindowResize );
  }

  public init() {
    this.camera.position.z = 2;

    const background: Actor2D = new Actor2D('background', this.level, 'assets/grass.jpg');
    background.sceneObject.scale.x = 6;
    background.sceneObject.scale.y = 3;
    this.level.createActor(background);

    const portal: Spawn = new Spawn('portal', this.level, 'assets/portal.png');
    portal.sceneObject.scale.x = 0.5;
    portal.sceneObject.scale.y = 0.5;
    portal.sceneObject.translateX(2.7);
    this.level.createActor(portal);

    const pit: Deathpit = new Deathpit('deathpit', this.level, 'assets/hellhole.png');
    pit.sceneObject.scale.x = 0.5;
    pit.sceneObject.scale.y = 0.5;
    pit.sceneObject.translateX(-2.7);
    this.level.createActor(pit);

    portal.activate();
  }

  tick(renderer: Renderer) {
    this.level.tick();

    // this.level.getActor('cube').addRotation(new THREE.Vector3(0, 0, 0.5))

    renderer.render(this.scene, this.camera);
  }
}
