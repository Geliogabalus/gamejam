import { Sprite } from 'three';
import type { Game } from '../core/game';
import { Actor2D } from '../core/actors/actor-2d';

export class Minion extends Actor2D {
  constructor(name: string, game: Game) {
    super(name, game, 'assets/monster.png');
    this.sceneObject.scale.x = 0.15;
    this.sceneObject.scale.y = 0.15;
  }

  tick(delta: number) {
    this.sceneObject.translateX(-this.game.state.minionSpeed * delta);

    const deathpitSprite = this.game.currentLevel.getActor('deathpit').sceneObject;
    if (deathpitSprite instanceof Sprite) {
      if (this.checkCollision(deathpitSprite)) {
        this.game.currentLevel.destroyActor(this);
        this.game.state.destroyedMinionsCount += 1;
      }
    }
  }

  onLeftMouseButtonClick() {
    this.game.currentLevel.destroyActor(this);
    this.game.state.destroyedMinionsCount += 1;
  }
}
