import * as THREE from "three";
import { Game } from "./core/game";

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
var game: Game;

var init = function () {
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    game = new Game({
        cameraType: "perspective"
    });
    game.init();
}

var animate = function () {
    requestAnimationFrame(animate)

    game.tick(renderer);    
};

init();
animate();