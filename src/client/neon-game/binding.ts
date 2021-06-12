import { BufferAttribute, BufferGeometry, CubicBezierCurve, Group, Line, LineBasicMaterial, Object3D, SplineCurve, Vector2, Vector3 } from 'three';
import { Game } from '../core/game';
import { Actor } from '../core/actors/actor';

export interface BindingOptions {
  length: number
}

export class Binding extends Actor {
  length: number;

  changeAmplitude = 0.5;

  changeSpeed = 7;

  lines: Line[] = [];

  curves: SplineCurve[];

  time: number = 0;

  constructor(name: string, game: Game, options: BindingOptions) {
    super(name, game);
    this.length = options.length;
    this.changeAmplitude = this.length / 150;

    this.sceneObject = new Group();

    this.curves = [
      new SplineCurve(
        [new Vector2(0, 0),
        new Vector2((this.length / 6) + (Math.random() * this.length / 4), 0),
        new Vector2((this.length * (4 / 5) - (Math.random() * this.length / 4)) , 0),
        new Vector2(this.length, 0)]
      ),
      new SplineCurve(
        [new Vector2(0, 0),
        new Vector2((this.length / 5) + (Math.random() * this.length / 4), 0),
        new Vector2((this.length * (4 / 5) - (Math.random() * this.length / 4)) , 0),
        new Vector2(this.length, 0)]
      ),
    ]

    const lineMaterials = [
      new LineBasicMaterial({ color: 0xff0000 }),
      new LineBasicMaterial({ color: 0x0000ff }),
    ]

    this.curves.forEach((curve, i) => {
      const points = curve.getPoints(20);
      const geometry = new BufferGeometry();
      const positions = new Float32Array(20 * 3);
      geometry.setAttribute('position', new BufferAttribute(positions, 3))
      for (let i = 0, l = 20; i < l; i++) {
        geometry.attributes.position.setXY(i, points[i].x, points[i].y);
      }
      const material = lineMaterials[i];
      const line = new Line(geometry, material);
      line.position.z += 0.01;
      this.sceneObject.add(line);
      this.lines.push(line);
    })
  }

  tick(delta: number) {
    this.time += delta * this.changeSpeed;

    this.curves.forEach((curve, index) => {
      curve.points[1].y += Math.sin(this.time) * Math.random() * this.changeAmplitude;
      curve.points[2].y += Math.cos(this.time) * Math.random() * -this.changeAmplitude;
      let points = curve.getPoints(20);

      for (let i = 0, l = 20; i < l; i++) {
        this.lines[index].geometry.attributes.position.setXYZ(i, points[i].x, points[i].y, 0);
      }
      
      this.lines[index].geometry.attributes.position.needsUpdate = true;
    })

  }
}
