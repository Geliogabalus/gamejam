import { Raycaster, Vector2 } from 'three';
import type { Game } from '../game';

export class Controls {
  private pointer = new Vector2();

  private raycaster = new Raycaster();

  private game: Game;

  constructor(game: Game) {
    this.game = game;

    document.addEventListener('pointermove', this.onPointerMove.bind(this));

    document.addEventListener('mousedown', this.onClick.bind(this));
  }

  onClick(event: MouseEvent) {
    this.pointer.x = (event.clientX / (window.innerHeight * (16 / 9))) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.game.currentCamera);

    const baseIntersect = this.raycaster.intersectObject(this.game.basePlane)[0];
    if (event.button === 0) {
      this.game.onLeftMouseButtonClick(baseIntersect.point);
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
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.game.currentCamera);

    const currentLevelActors = this.game.currentLevel.allActors;
    currentLevelActors.forEach((actor) => {
      const intersects = this.raycaster.intersectObject(actor.sceneObject, true);

      if (intersects.length > 0) {
        const intersection = intersects.filter((int) => int && int.object)[0];

        if (intersection && intersection.object) {
          if (!actor.isHovered) {
            actor.setHovered(true);
            actor.onHoverStart();
          }
        }
      } else if (actor.isHovered) {
        actor.setHovered(false);
        actor.onHoverEnd();
      }
    });
  }
}
