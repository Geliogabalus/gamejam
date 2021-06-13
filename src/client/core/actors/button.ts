// eslint-disable-next-line import/no-cycle
import { CursorType } from '../game';
import { Actor2D } from './actor-2d';

export class Button extends Actor2D {
  onHoverStart() {
    this.game.setCursor(CursorType.POINTER);
  }

  onHoverEnd() {
    this.game.setCursor(CursorType.DEFAULT);
  }
}
