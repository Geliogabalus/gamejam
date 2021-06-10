import * as THREE from 'three';
import { Timer } from './core/timer';
import { Game } from './core/game';

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
const timer = new Timer();
let game: Game;

const init = () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  game = new Game({
    cameraType: 'orthographic',
    renderer,
  });
  game.init();

  renderer.setAnimationLoop(() => {
    timer.update();
    const delta = timer.getDelta();
    game.tick(renderer, delta);
  });
};

init();
