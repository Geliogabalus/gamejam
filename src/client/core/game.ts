import * as THREE from "three"
import { Renderer } from "three";
import { isConstructorDeclaration } from "typescript";
import { Actor } from "./actor";
import { Level } from "./level";

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
                this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 100)
            case 'perspective':
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
            default:
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        } 
    }

    public init() {
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry()
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })

        const cube: Actor = new Actor('cube')
        cube.mesh = new THREE.Mesh(geometry, material)

        this.level.createActor(cube);

        this.camera.position.z = 2
    }

    tick(renderer: Renderer) {
        this.level.getActor('cube').addRotation(new THREE.Vector3(0.01, 0.01, 0))

        renderer.render(this.scene, this.camera);
    }
}