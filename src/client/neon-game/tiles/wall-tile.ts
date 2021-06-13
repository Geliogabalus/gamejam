import { Game } from 'core/game';
import { Sprite, SpriteMaterial, TextureLoader } from 'three';
import { Tile, TileType } from '../tile';

export class WallTile extends Tile {
  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game, type);
    const loader = new TextureLoader();
    const texture = loader.load(`assets/walls/${code}.png`);
    const material = new SpriteMaterial({ map: texture, alphaTest: 0 });
    this.sceneObject = new Sprite(material);
    this.sceneObject.position.x = this.sceneObject.scale.x / 2;
    this.sceneObject.position.y = -this.sceneObject.scale.y / 2;
    this.sceneObject.position.z = -0.001;
    this.objectWrapper.add(this.sceneObject);
  }
}
