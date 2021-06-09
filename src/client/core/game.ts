import * as THREE from 'three';
import { OrthographicCamera, Renderer } from 'three';
import * as fgui from 'fairygui-three';
import { Deathpit } from '../td/deathpit';
import { Spawn } from '../td/spawn';
import { Actor2D } from './2d-actor';
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

  private gui: fgui.GComponent = new fgui.GComponent();

  readonly settings: { [key: string]: any } = {
    minionSpeed: 1,
  };

  constructor(settings: GameSettings) {
    const aspectRatio = window.innerWidth / window.innerHeight;
    switch (settings.cameraType) {
      case 'orthographic':
        this.camera = new THREE.OrthographicCamera((-aspectRatio * this.viewSize) / 2, (aspectRatio * this.viewSize) / 2,
          this.viewSize / 2, -this.viewSize / 2, 0.1, 1000);
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
    this.level = new Level(this.scene, this.camera, this.settings);

    const onWindowResize = () => {
      const aspect = window.innerWidth / window.innerHeight;

      if (this.camera instanceof OrthographicCamera) {
        this.camera.left = (-aspect * this.viewSize) / 2;
        this.camera.right = (aspect * this.viewSize) / 2;
        this.camera.updateProjectionMatrix();
      }

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Не работает
    fgui.Stage.init(this.renderer);
    fgui.Stage.scene = this.scene;
    fgui.UIPackage.loadPackage('assets/gui').then(() => {
      this.gui = fgui.UIPackage.createObject('Package', 'Main').asCom;
      this.gui.makeFullScreen();
      fgui.GRoot.inst.addChild(this.gui);
    });
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

    // const minionsFolder = this.gui.addFolder('Minions');
    // minionsFolder.add(this.settings, 'minionSpeed').name('Minion speed').listen();
    // minionsFolder.open();
  }

  tick(renderer: Renderer, delta: number) {
    this.level.tick(delta);
    fgui.Stage.update();
    // this.level.getActor('cube').addRotation(new THREE.Vector3(0, 0, 0.5))

    renderer.render(this.scene, this.camera);
  }
}
