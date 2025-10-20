import type { PerspectiveCamera, Vector3 } from "three";
import type { IGameContext } from "./shared-interfaces";

export class CameraController {
  readonly camera: PerspectiveCamera;
  readonly gameContext: IGameContext;

  constructor(camera: PerspectiveCamera, gameContext: IGameContext) {
    this.camera = camera;
    this.gameContext = gameContext;
  }

  update(deltaTime: number, targetPosition: Vector3) {
    const idealPos = targetPosition.clone().add(this.gameContext.camera.offset);
    this.camera.position.lerp(
      idealPos,
      this.gameContext.camera.followSpeed * deltaTime
    );

    const lookTarget = targetPosition
      .clone()
      .add(this.gameContext.camera.lookOffset);
    this.camera.lookAt(lookTarget);
  }
}
