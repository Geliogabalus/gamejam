import * as THREE from "three";
import { Mesh, Sprite } from "three";

export interface BuilderOptions {
  texturePath: string
}

export class Builder {
  static createPlane(options: BuilderOptions): Mesh {
    const texture = new THREE.TextureLoader().load(options.texturePath);
    const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
      visible: true,
      map: texture,
      transparent: true,
    });
    const geometryPlane: THREE.PlaneGeometry = new THREE.PlaneGeometry();
    return new THREE.Mesh(geometryPlane, material);
  }

  static createSprite(options: BuilderOptions): Sprite {
    const texture = new THREE.TextureLoader().load(options.texturePath);
    const material: THREE.SpriteMaterial = new THREE.SpriteMaterial({
      visible: true,
      map: texture,
      transparent: true,
    });
    return new THREE.Sprite(material);
  }
}