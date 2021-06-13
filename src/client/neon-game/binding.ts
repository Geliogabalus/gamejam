import {
  BufferAttribute, BufferGeometry, Group, Line, LineBasicMaterial, SplineCurve, Vector2,
} from 'three';
import { Actor } from '../core/actors/actor';
import type { Game } from '../core/game';

export interface BindingOptions {
  length: number
}

export class Binding extends Actor {
  length: number;

  changeAmplitude: number;

  changeSpeed = 3;

  lines: Line[] = [];

  curves: SplineCurve[];

  time: number = 0;

  constructor(name: string, game: Game, options: BindingOptions) {
    super(name, game);
    this.length = options.length;
    this.changeAmplitude = this.length / 300;

    this.sceneObject = new Group();

    this.curves = [
      new SplineCurve(
        [new Vector2(0, 0),
          new Vector2((this.length / 3), 0),
          new Vector2((this.length * (2 / 3)), 0),
          new Vector2(this.length, 0)],
      ),
      new SplineCurve(
        [new Vector2(0, 0),
          new Vector2((this.length / 3), 0),
          new Vector2((this.length * (2 / 3)), 0),
          new Vector2(this.length, 0)],
      ),
    ];

    const lineMaterials = [
      new LineBasicMaterial({ color: 0xff0000 }),
      new LineBasicMaterial({ color: 0x0000ff }),
    ];

    this.curves.forEach((curve, index) => {
      const points = curve.getPoints(20);
      const geometry = new BufferGeometry();
      const positions = new Float32Array(20 * 3);
      geometry.setAttribute('position', new BufferAttribute(positions, 3));
      for (let i = 0, l = 20; i < l; i += 1) {
        geometry.attributes.position.setXYZ(i, points[i].x, points[i].y, 0);
      }
      const material = lineMaterials[index];
      const line = new Line(geometry, material);
      line.layers.enable(this.game.BLOOM_SCENE);
      // line.computeLineDistances()
      line.position.z += 0.01;
      this.sceneObject.add(line);
      this.lines.push(line);
    });
  }

  tick(delta: number) {
    this.time += delta * this.changeSpeed;

    const curve1 = this.curves[0];
    curve1.points[1].y += Math.sin(this.time + 1) * this.changeAmplitude;
    curve1.points[2].y += Math.sin(this.time + 1) * -this.changeAmplitude;
    const points1 = curve1.getPoints(20);
    for (let i = 0, l = 20; i < l; i += 1) {
      this.lines[0].geometry.attributes.position.setXYZ(i, points1[i].x, points1[i].y, 0);
    }
    this.lines[0].geometry.attributes.position.needsUpdate = true;

    const curve2 = this.curves[1];
    curve2.points[1].y += Math.sin(this.time) * this.changeAmplitude;
    curve2.points[2].y += Math.sin(this.time) * -this.changeAmplitude;
    const points2 = curve2.getPoints(20);
    for (let i = 0, l = 20; i < l; i += 1) {
      this.lines[1].geometry.attributes.position.setXYZ(i, points2[i].x, points2[i].y, 0);
    }

    this.lines[1].geometry.attributes.position.needsUpdate = true;
  }
}
