import { Game } from 'core/game';
import { Sprite, SpriteMaterial, TextureLoader } from 'three';
import { TileType } from '../tile';
import { DefaultTile } from './default-tile';

export class StarTile extends DefaultTile {
  collected = false;

  emptySprite: Sprite;

  constructor(name: string, game: Game, type: TileType, code: string) {
    super(name, game, type, code);
    let loader = new TextureLoader();
    const texture = loader.load('assets/star.png')
    const material = new SpriteMaterial({ transparent: true, opacity: 1, map: texture });
    this.sceneObject = new Sprite(material);
    // this.sceneObject.layers.toggle(this.game.BLOOM_SCENE);
    this.objectWrapper.add(this.sceneObject);

    loader = new TextureLoader();
    const emptyTexture = loader.load(`assets/walls/${code}.png`);
    const emptyMaterial = new SpriteMaterial({ map: emptyTexture, alphaTest: 0 });
    this.emptySprite = new Sprite(emptyMaterial);
    this.emptySprite.position.x = this.sceneObject.scale.x / 2;
    this.emptySprite.position.y = -this.sceneObject.scale.y / 2;
  }

  collect() {
    this.collected = true;
    this.objectWrapper.remove(this.sceneObject);
    this.objectWrapper.add(this.emptySprite);
  }

  reset() {
    this.collected = false;
    this.objectWrapper.remove(this.emptySprite);
    this.objectWrapper.add(this.sceneObject);
  }
}
