import * as THREE from 'three';
import {
  Camera, Renderer,
} from 'three';
import { Actor2D } from './actors/actor-2d';
import { Controls } from './controls/controls';
import { Gui } from './gui/gui';
import { Level } from './level';

export interface GameSettings {
  cameraType?: 'perspective' | 'orthographic',
  renderer: Renderer
}

export class Game {
  scene: THREE.Scene;

  private camera: THREE.Camera;

  private level: Level;

  readonly width = 160;

  readonly height = 90;

  renderer: Renderer;

  private controls: Controls;

  private gui: Gui;

  readonly state: { [key: string]: any } = {
  };

  constructor(settings: GameSettings) {
    const aspectRatio = this.width / this.height;
    switch (settings.cameraType) {
      case 'orthographic':
        this.camera = new THREE.OrthographicCamera((-aspectRatio * this.height) / 2, (aspectRatio * this.height) / 2,
          this.height / 2, -this.height / 2, 0.1, 1000);
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
    this.level = new Level(this);
    this.controls = new Controls(this);
    this.gui = new Gui({ width: 100, height: 50 });
    document.body.appendChild(this.gui.dom);

    // Отключение изменения размера экрана
    /* const onWindowResize = () => {
      const aspect = window.innerWidth / window.innerHeight;

      if (this.camera instanceof OrthographicCamera) {
        this.camera.left = (-aspect * this.viewSize) / 2;
        this.camera.right = (aspect * this.viewSize) / 2;
        this.camera.updateProjectionMatrix();
      }

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize); */
  }

  public init() {
    this.camera.position.z = 10;

    const background: Actor2D = new Actor2D('background', this, 'assets/grass.jpg');
    background.sceneObject.scale.x = this.width;
    background.sceneObject.scale.y = this.height;
    this.level.createActor(background);
  }

  tick(renderer: Renderer, delta: number) {
    this.level.tick(delta);
    this.gui.update();
    // this.level.getActor('cube').addRotation(new THREE.Vector3(0, 0, 0.5))

    renderer.render(this.scene, this.camera);
  }

  public get currentCamera() : Camera {
    return this.camera;
  }

  public get currentLevel() : Level {
    return this.level;
  }
}
