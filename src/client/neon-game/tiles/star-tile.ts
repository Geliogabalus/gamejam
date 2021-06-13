import { Game } from 'core/game';
import { Sprite, SpriteMaterial, TextureLoader } from 'three';
import { TileType } from '../tile';
import { DefaultTile } from './default-tile';

export class StarTile extends DefaultTile {
  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game, type, code);
    const loader = new TextureLoader();
    const texture = loader.load('assets/star.png')
    const material = new SpriteMaterial({ transparent: true, opacity: 1, map: texture });
    this.sceneObject = new Sprite(material);
    this.objectWrapper.add(this.sceneObject);
  }
}
