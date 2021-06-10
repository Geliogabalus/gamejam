import { Vector2 } from 'three';

export class GuiElement {
  readonly name: string;

  position: Vector2;

  element!: HTMLDivElement;

  constructor(name: string, position: Vector2) {
    this.name = name;
    this.position = position;
  }

  update() {}
}
