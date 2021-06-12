import { Vector2, Vector3 } from 'three';

export class Utils {
  static Vector3toVector2(vector3: Vector3): Vector2 {
    return new Vector2(vector3.x, vector3.y);
  }
}
