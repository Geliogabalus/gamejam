import * as THREE from "three";
import { Mesh } from "three";

export interface MeshOptions {
  texturePath: string
}

export class MeshHelper {
  static createPlane(options: MeshOptions): Mesh {
    const texture = new THREE.TextureLoader().load(options.texturePath);
    const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      visible: true,
      map: texture,
      transparent: true,
    });
    const geometryPlane: THREE.PlaneGeometry = new THREE.PlaneGeometry();
    return new THREE.Mesh(geometryPlane, material);
  }
}