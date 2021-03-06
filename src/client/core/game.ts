import * as THREE from 'three';
import {
  Camera, Layers, Line, Material, Mesh, MeshBasicMaterial, NearestMipmapLinearFilter, Object3D,
  Renderer, Sprite, Vector, Vector2, Vector3, WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { Circle } from '../neon-game/circle';
import { Pin } from '../neon-game/pin';
import { Controls } from './controls/controls';
import { Gui } from './gui/gui';
import { Level } from './level';
import { Map } from '../neon-game/map';
import { LevelBuilder } from '../neon-game/level-builder';
import { createSound } from './misc/createSound';
import { Actor2D } from './actors/actor-2d';
import { Builder } from './misc/builder';
import { Button } from './actors/button';

export interface GameSettings {
  cameraType?: 'perspective' | 'orthographic',
  renderer: WebGLRenderer
}

export enum GamePhase {
  MENU,
  GAME
}

export enum CursorType {
  DEFAULT,
  POINTER,
  POINTER_ERROR
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

  private glitchPass: GlitchPass;

  private bloomLayer = new Layers();

  readonly materials: { [key: string]: Material } = {};

  readonly darkSpriteMaterial = new THREE.SpriteMaterial({ color: 'black' });

  readonly darkLineMaterial = new THREE.LineBasicMaterial({ color: 'black' });

  glitching = false;

  basePlane!: Mesh;

  map!: Map;

  startPosition = new Vector2();

  readonly state: { [key: string]: any } = {
    circleSpeed: 10,
    currentLevelStars: 0,
    currentPhase: GamePhase.MENU,
    currentLevel: 1,
    currentPlayerData: {
      levelStats: []
    }
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

    // ????????????????????????????
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

    this.glitchPass = new GlitchPass();

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
    // this.finalComposer.addPass(this.glitchPass);
    // ???????????????????? ?????????????????? ?????????????? ????????????
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

    this.playMusic();
    this.setCursor(CursorType.DEFAULT);
  }

  setCursor(type: CursorType) {
    switch (type) {
      case CursorType.POINTER:
        document.body.style.cursor = "url('assets/Select_blue.png'), auto";
        break;
      case CursorType.POINTER_ERROR:
        document.body.style.cursor = "url('assets/Select_red.png'), auto";
        break;
      case CursorType.DEFAULT:
        document.body.style.cursor = "url('assets/Arrow_blue.png'), auto";
      default:
        break;
    }
    // document.body.style.cursor = "pointer"
  }

  private playMusic() {
    const sound = createSound('assets/music/level1.wav', 0.1, true);
    sound.play();
  }

  toNextLevel() {
    const pin: Pin = <Pin>(this.level.getActor('pin'));
    if (pin) {
      this.level.removeActor(pin);
    }
    const circle: Circle = <Circle>(this.level.getActor('circle'));
    if (circle) {
      this.level.removeActor(circle);
    }

    if (this.state.currentLevel === 7) {
      const buttonMenu = new Button('buttonMenu', this, 'assets/buttonMenu.png');
      buttonMenu.sceneObject.scale.x = 60;
      buttonMenu.sceneObject.scale.y = 24;
      //buttonMenu.sceneObject.position.x = 140;
      buttonMenu.sceneObject.position.z = 1;
      this.level.addActor(buttonMenu);
  
      buttonMenu.onLeftMouseButtonClick = () => {
        this.state.currentLevelStars = 0;
        this.state.currentPhase = GamePhase.MENU;
        this.state.currentLevel = 1;
        this.createScene();
      }
    } else {
      const buttonNext = new Button('buttonNext', this, 'assets/buttonNext.png');
      buttonNext.sceneObject.scale.x = 20;
      buttonNext.sceneObject.scale.y = 8;
      //buttonMenu.sceneObject.position.x = 140;
      buttonNext.sceneObject.position.z = 1;
      this.level.addActor(buttonNext);
  
      buttonNext.onLeftMouseButtonClick = () => {
        this.state.currentLevelStars = 0;
        this.state.circleSpeed += 1;
        this.state.currentLevel += 1;
        this.createScene();
      }
    }
  }

  public createScene() {
    this.level.clear();

    this.basePlane = new Mesh(new THREE.PlaneGeometry(1000, 1000), new MeshBasicMaterial());
    this.basePlane.visible = false;
    this.scene.add(this.basePlane);

    this.camera.position.z = 10;
    switch (this.state.currentPhase) {
      case GamePhase.GAME:
        LevelBuilder.loadMap(this.state.currentLevel, this);

        const buttonMenu = new Button('buttonMenu', this, 'assets/buttonMenu.png');
        buttonMenu.sceneObject.scale.x = 20;
        buttonMenu.sceneObject.scale.y = 8;
        //buttonMenu.sceneObject.position.x = 140;
        buttonMenu.sceneObject.position.y = 40.5;
        buttonMenu.sceneObject.position.z = 1;
        this.level.addActor(buttonMenu);

        buttonMenu.onLeftMouseButtonClick = () => {
          this.state.currentPhase = GamePhase.MENU;
          this.createScene();
        }
        break;
      case GamePhase.MENU:
      default:
        const mainMenu = new Actor2D('mainMenu', this, 'assets/main-menu.jpg');
        mainMenu.sceneObject.scale.x = 160;
        mainMenu.sceneObject.scale.y = 90;
        this.level.addActor(mainMenu);

        const header = new Actor2D('header', this, 'assets/header.png');
        header.sceneObject.scale.x = 100;
        header.sceneObject.scale.y = 25;
        header.sceneObject.position.y = 25;
        this.level.addActor(header);

        const buttonPlay = new Button('buttonPlay', this, 'assets/buttonPlay.png');
        buttonPlay.sceneObject.scale.x = 60;
        buttonPlay.sceneObject.scale.y = 24;
        buttonPlay.sceneObject.position.y = -10;
        buttonPlay.sceneObject.position.z = 0.01;
        this.level.addActor(buttonPlay);

        buttonPlay.onLeftMouseButtonClick = () => {
          this.state.currentPhase = GamePhase.GAME;
          this.state.currentLevelStars = 0;
          this.createScene();
        }

        break;
    }
  }

  initPinPosition() {
    setTimeout(() => {
      const pin: Pin = new Pin('pin', this, 0.5);
      pin.sceneObject.scale.x = 1;
      pin.sceneObject.scale.y = 1;
      this.level.addActor(pin);

      const circle: Circle = new Circle('circle', this, 1);
      circle.sceneObject.position.x = 5;
      this.level.addActor(circle);

      pin.attachCircle(circle);
      pin.sceneObject.position.set(this.startPosition.x, this.startPosition.y, 0);
    }, 200)
  }

  restart() {
    this.state.currentLevelStars = 0;
    this.map.starTiles.forEach(t => t.reset());

    const pin: Pin = <Pin>(this.level.getActor('pin'));
    if (pin) {
      this.level.removeActor(pin);
    }
    const circle: Circle = <Circle>(this.level.getActor('circle'));
    if (circle) {
      this.level.removeActor(circle);
    }
    this.initPinPosition();
  }

  tick(renderer: Renderer, delta: number) {
    this.level.tick(delta);
    this.gui.update();
    // this.level.getActor('cube').addRotation(new THREE.Vector3(0, 0, 0.5))

    // render
    this.renderBloom();
    this.finalComposer.render();
  }

  placePin(point: Vector3) {
    const newPin: Pin = new Pin('pin', this, 0.5);
    newPin.sceneObject.scale.x = 1;
    newPin.sceneObject.scale.y = 1;
    newPin.sceneObject.position.set(point.x, point.y, 0);
    this.currentLevel.addActor(newPin);

    const circle = <Circle>(this.currentLevel.getActor('circle'));
    newPin.attachCircle(circle);
  }

  releasePin() {
    const pin: Pin = <Pin>(this.currentLevel.getActor('pin'));
    if (pin) {
      pin.releaseCircle();
      this.currentLevel.removeActor(pin);
    }
  }

  onLeftMouseButtonUp() {
    this.releasePin();
  }

  onLeftMouseButtonDown(point: Vector3) {
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

  public get currentCamera(): Camera {
    return this.camera;
  }

  public get currentLevel(): Level {
    return this.level;
  }
}
