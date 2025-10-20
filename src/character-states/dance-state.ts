import * as THREE from 'three';
import type { IGameContext, IStateStrategy } from "../shared-interfaces";

export class DanceState implements IStateStrategy {
  readonly name = 'dance';
  private finishedCallback: () => void;
  private isFinished = false;

  constructor() {
    this.finishedCallback = () => {
      this.isFinished = true;
    };
  }

  enter(context: IGameContext, prevState: IStateStrategy | null): void {
    this.isFinished = false;
    const action = context.animations[this.name].action;
    const mixer = action.getMixer();
    mixer.addEventListener('finished', this.finishedCallback);

    if (prevState) {
      const prevAction = context.animations[prevState.name].action;

      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.crossFadeFrom(prevAction, 0.5, true);
    }
    action.play();
  }

  exit(context: IGameContext): void {
    const action = context.animations[this.name].action;
    action.getMixer().removeEventListener('finished', this.finishedCallback);
    console.log('dance exit');
  }

  update(context: IGameContext, deltaTime: number): string | null {
    if (this.isFinished || context.input.isMoving()) {
      return 'idle';
    }
    
    return null;
  }
}