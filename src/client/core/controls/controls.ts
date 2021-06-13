import { Actor } from '../actors/actor';
import { Raycaster, Vector2 } from 'three';
import type { Game } from '../game';

export class Controls {
  private pointer = new Vector2();

  private raycaster = new Raycaster();

  private game: Game;

  constructor(game: Game) {
    this.game = game;

    document.addEventListener('pointermove', this.onPointerMove.bind(this));

    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.game.onLeftMouseButtonUp();
    }
  }

  onMouseDown(event: MouseEvent) {
    this.pointer.x = (event.clientX / (window.innerHeight * (16 / 9))) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.game.currentCamera);

    const baseIntersect = this.raycaster.intersectObject(this.game.basePlane)[0];
    if (event.button === 0) {
      this.game.onLeftMouseButtonDown(baseIntersect.point);
    }

    const intersects = this.raycaster.intersectObjects(this.game.currentLevel.allObjects, true);
    if (intersects.length > 0) {
      intersects.sort((a, b) => a.distance - b.distance);
      const intersection = intersects[0];

      if (intersection && intersection.object) {
        const clickedActor = this.game.currentLevel.actorsByObjectUuid[intersection.object.uuid];
        if (clickedActor) {
          if (event.button === 0) {
            clickedActor.onLeftMouseButtonClick(intersection.point);
          }
        }
      }
    }
  }

  onPointerMove(event: PointerEvent) {
    this.pointer.x = (event.clientX / (window.innerHeight * (16 / 9))) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.game.currentCamera);

    const intersects = this.raycaster.intersectObjects(this.game.currentLevel.allObjects, true);
    let hoveredActor: Actor | null = null;
    if (intersects.length > 0) {
      intersects.sort((a, b) => a.distance - b.distance);
      const intersection = intersects[0];

      if (intersection && intersection.object) {
        hoveredActor = this.game.currentLevel.actorsByObjectUuid[intersection.object.uuid];
        if (hoveredActor) {
          if (!hoveredActor.isHovered) {
            hoveredActor.setHovered(true);
            hoveredActor.onHoverStart();
          }
        }
      }
    }
    if (hoveredActor instanceof Actor) {
      this.game.currentLevel.allActors.forEach(a => {
        if (a.name !== (<Actor>hoveredActor).name) {
          if (a.isHovered) {
            a.setHovered(false);
            a.onHoverEnd();
          }
        }
      })
    }
  }
}
