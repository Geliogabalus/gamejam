import * as THREE from 'three';
import { Game } from './core/game';

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
let game: Game;

const init = () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  game = new Game({
    cameraType: 'orthographic',
    renderer: renderer
  });
  game.init();
};

const animate = () => {
  requestAnimationFrame(animate);

  game.tick(renderer);
};

init();
animate();
