import { Spawn } from "../td/spawn";
import * as THREE from "three"
import { Renderer } from "three";
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
                this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
                break;
            case 'perspective':
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
                break;
            default:
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
                break;
        } 
    }

    public init() {
        const grassTexture = new THREE.TextureLoader().load('assets/grass.jpg');
        /*const cube: Actor = new Actor('cube')
        cube.mesh = new THREE.Mesh(geometry, material)*/
        const background: Actor = new Actor('background', this.level)
        const backgroundMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ visible: true, map: grassTexture })
        const geometryPlane: THREE.PlaneGeometry = new THREE.PlaneGeometry()
        background.mesh = new THREE.Mesh(geometryPlane, backgroundMaterial);
        background.mesh.scale.x = 6;
        background.mesh.scale.y = 3;
        this.level.createActor(background);

        const portalTexture = new THREE.TextureLoader().load('assets/portal.png');
        /*const cube: Actor = new Actor('cube')
        cube.mesh = new THREE.Mesh(geometry, material)*/
        const portal: Spawn = new Spawn('portal', this.level)
        const portalMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ visible: true, map: portalTexture, transparent: true })
        portal.mesh = new THREE.Mesh(geometryPlane, portalMaterial);
        portal.mesh.scale.x = 0.5;
        portal.mesh.scale.y = 0.5;
        portal.mesh.translateX(2.7);
        this.level.createActor(portal);

        portal.activate();
        this.camera.position.z = 2
    }

    tick(renderer: Renderer) {
        this.level.tick();
        
        //this.level.getActor('cube').addRotation(new THREE.Vector3(0, 0, 0.5))

        renderer.render(this.scene, this.camera);
    }
}