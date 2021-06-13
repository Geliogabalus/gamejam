import { Game } from 'core/game';
import { Sprite, SpriteMaterial } from 'three';
import { TileType } from '../tile';
import { DefaultTile } from './default-tile';

export class FinishTile extends DefaultTile {
  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game, type, code);
    /* const loader = new TextureLoader();
    const texture = loader.load(`assets/walls/${code}.png`);
    const material = new SpriteMaterial({ transparent: true, opacity: 1, map: texture });
    const sprite = new Sprite(material); */
    const tileMaterial = new SpriteMaterial({ color: 0xff0000 });
    this.sceneObject = new Sprite(tileMaterial);
    this.objectWrapper.add(this.sceneObject);
  }
}
