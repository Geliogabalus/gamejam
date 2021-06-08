import { Mesh } from "three";
import { Level } from "./level";

export class Actor {
    public readonly name: string;
    level: Level;
    mesh: THREE.Mesh;

    
    constructor(name: string, level: Level) {
        this.name = name;
        this.level = level;
        this.mesh = new Mesh();
    }

    addRotation(rotation: THREE.Vector3) {
        if (this.mesh) {
            this.mesh.rotation.x += rotation.x
            this.mesh.rotation.y += rotation.y
            this.mesh.rotation.y += rotation.y
        } 
    }

    translate(translate: THREE.Vector3) {
        if (this.mesh) {
            this.mesh.translateX(translate.x)
            this.mesh.translateZ(translate.y)
            this.mesh.translateY(translate.z)
        } 
    }

    setScale(scale: THREE.Vector3) {
        if (this.mesh) {
            this.mesh.scale.set(scale.x, scale.y, scale.z);
        } 
    }

    tick() {
        
    }
}