import * as THREE from 'three';
import {
  Camera, Layers, Line, Material, Object3D, Renderer, Sprite, WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Field } from '../neon-game/field';
import { Circle } from '../neon-game/circle';
import { Pin } from '../neon-game/pin';
import { Controls } from './controls/controls';
import { Gui } from './gui/gui';
import { Level } from './level';

export interface GameSettings {
  cameraType?: 'perspective' | 'orthographic',
  renderer: WebGLRenderer
}

export class Game {
  scene: THREE.Scene;

  readonly BLOOM_SCENE = 1;

  private camera: THREE.Camera;

  private level: Level;

  readonly width = 160;

  readonly height = 90;

  renderer: WebGLRenderer;

  private controls: Controls;

  private gui: Gui;

  private finalComposer: EffectComposer;

  private bloomComposer: EffectComposer;

  private bloomLayer = new Layers();

  readonly materials:{ [key: string]: Material } = {};

  readonly darkSpriteMaterial = new THREE.SpriteMaterial({ color: 'black' });

  readonly darkLineMaterial = new THREE.LineBasicMaterial({ color: 'black' });

  readonly state: { [key: string]: any } = {
    circleSpeed: 20,
  };

  constructor(settings: GameSettings) {
    switch (settings.cameraType) {
      case 'orthographic':
        this.camera = new THREE.OrthographicCamera((-this.width) / 2, (this.width) / 2,
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

    // Постпроцессинг
    const renderScene = new RenderPass(this.scene, this.camera);

    this.bloomLayer.set(this.BLOOM_SCENE);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 5;
    bloomPass.radius = 0;

    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(renderScene);
    this.bloomComposer.addPass(bloomPass);

    const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
        },
        vertexShader:
        ` varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader:
        ` uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
          varying vec2 vUv;
          
          void main() {
            gl_FragColor = (texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv));
          }
        `,
        defines: {},
      }), 'baseTexture',
    );
    finalPass.needsSwap = true;

    this.finalComposer = new EffectComposer(this.renderer);
    this.finalComposer.addPass(renderScene);
    this.finalComposer.addPass(finalPass);
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

    const field: Field = new Field('background', this, 'assets/grass.jpg');
    field.sceneObject.scale.x = this.width;
    field.sceneObject.scale.y = this.height;
    this.level.addActor(field);

    const pin: Pin = new Pin('pin', this, 'assets/pin.png');
    pin.sceneObject.scale.x = 1;
    pin.sceneObject.scale.y = 1;
    this.level.addActor(pin);

    const circle: Circle = new Circle('circle', this, 'assets/circle.png');
    circle.sceneObject.scale.x = 3;
    circle.sceneObject.scale.y = 3;
    circle.sceneObject.position.x = 20;
    this.level.addActor(circle);

    pin.attachCircle(circle);
  }

  tick(renderer: Renderer, delta: number) {
    this.level.tick(delta);
    this.gui.update();
    // this.level.getActor('cube').addRotation(new THREE.Vector3(0, 0, 0.5))

    // render
    this.renderBloom();
    this.finalComposer.render();
  }

  renderBloom() {
    this.scene.traverse(this.darkenNonBloomed.bind(this));
    this.bloomComposer.render();
    this.scene.traverse(this.restoreMaterial.bind(this));
  }

  darkenNonBloomed(obj: Object3D) {
    if (this.bloomLayer.test(obj.layers) === false) {
      if (obj instanceof Sprite) {
        this.materials[obj.uuid] = (<any>obj).material;
        (<any>obj).material = this.darkSpriteMaterial;
      }

      if (obj instanceof Line) {
        this.materials[obj.uuid] = (<any>obj).material;
        (<any>obj).material = this.darkLineMaterial;
      }
    }
  }

  restoreMaterial(obj: Object3D) {
    if (this.materials[obj.uuid]) {
      (<any>obj).material = this.materials[obj.uuid];
      delete this.materials[obj.uuid];
    }
  }

  public get currentCamera() : Camera {
    return this.camera;
  }

  public get currentLevel() : Level {
    return this.level;
  }
}
