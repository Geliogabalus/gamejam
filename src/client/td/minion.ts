import { Level } from "core/level";
import * as THREE from "three";
import { Actor } from "../core/actor";

export class Minion extends Actor {
    constructor(name: string, level: Level) {
        super(name, level);
        const geometryPlane: THREE.PlaneGeometry = new THREE.PlaneGeometry()
        const miniomTexture = new THREE.TextureLoader().load('assets/monster.png');
        const minionMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ visible: true, map: miniomTexture, transparent: true })
        this.mesh = new THREE.Mesh(geometryPlane, minionMaterial);  
        this.mesh.scale.x = 0.1
        this.mesh.scale.y = 0.1
    }

    tick() {
        this.mesh.translateX(-0.001);
    }
}