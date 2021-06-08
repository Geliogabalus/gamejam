export class Actor {
    public readonly name: string;
    mesh: THREE.Mesh | null = null;

    constructor(name: string) {
        this.name = name;
    }

    addRotation(rotation: THREE.Vector3) {
        if (this.mesh) {
            this.mesh.rotation.x += rotation.x
            this.mesh.rotation.y += rotation.y
            this.mesh.rotation.y += rotation.y
        } 
    }
}