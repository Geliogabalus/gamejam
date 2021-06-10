import { GuiElement } from './gui-element';

export interface GuiOptions {
  width: number,
  height: number
}

export class Gui {
  dom: HTMLDivElement;

  pr = Math.round(window.devicePixelRatio || 1);

  width: number;

  height: number;

  elements: GuiElement[] = [];
  // canvas: HTMLCanvasElement;

  constructor(options: GuiOptions) {
    this.dom = document.createElement('div');
    this.dom.style.cssText = 'position:fixed;top:0;left:0;opacity:1;z-index:10000';

    this.width = options.width * this.pr;
    this.height = options.height * this.pr;

    this.dom.style.width = `${this.width}px`;
    this.dom.style.height = `${this.height}px`;

    /* this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.style.width = `${this.width}px`; */
  }

  addElement(element: GuiElement) {
    this.elements.push(element);
    this.dom.append(element.element);
  }

  update() {
    this.elements.forEach((el) => {
      el.update();
    });
  }
}
