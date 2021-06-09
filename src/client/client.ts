import * as THREE from 'three';
import { Game } from './core/game';

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
const clock = new THREE.Clock();
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
    const delta = clock.getDelta();
    game.tick(renderer, delta);
  });
};

init();
