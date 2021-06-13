import { Game } from 'core/game';
import { Sprite, SpriteMaterial, TextureLoader } from 'three';
import { TileType } from '../tile';
import { DefaultTile } from './default-tile';

export class FinishTile extends DefaultTile {
  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game, type, code);
    let loader = new TextureLoader();
    const texture = loader.load('assets/finish.png')
    const material = new SpriteMaterial({ map: texture, alphaTest: 0 });
    this.sceneObject = new Sprite(material);
    this.sceneObject.scale.set(2, 2, 1)
    this.sceneObject.layers.toggle(this.game.BLOOM_SCENE);
    this.objectWrapper.add(this.sceneObject);
  }
}
