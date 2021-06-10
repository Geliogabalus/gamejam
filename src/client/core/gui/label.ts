import { Vector2 } from 'three';
import { GuiElement } from './gui-element';

export class Label extends GuiElement {
  element: HTMLDivElement;

  private textCallback: (() => string) | null = null;

  constructor(name: string, position: Vector2, text: string | (() => string), css: string = '') {
    super(name, position);

    this.element = document.createElement('div');

    this.element.style.cssText = css;
    this.element.style.position = 'absolute';
    this.element.style.top = `${position.y}px`;
    this.element.style.left = `${position.x}px`;
    this.element.style.userSelect = 'none';

    if (typeof text === 'string') {
      this.element.innerHTML = text;
    } else {
      this.textCallback = text;
      this.element.innerHTML = this.textCallback();
    }
  }

  setText(text: string) {
    this.element.innerHTML = text;
  }

  update() {
    if (this.textCallback) {
      this.element.innerHTML = this.textCallback();
    }
  }
}
