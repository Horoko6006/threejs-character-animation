import type { IGameContext, IStateStrategy } from "../shared-interfaces";

export class RunState implements IStateStrategy {
  readonly name = 'run';

  enter(context: IGameContext, prevState: IStateStrategy | null): void {
    const action = context.animations[this.name].action;
    
    if (prevState) {
      const prevAction = context.animations[prevState.name].action;
      action.enabled = true;
      
      if (prevState.name === 'walk') {
        const ratio = action.getClip().duration / prevAction.getClip().duration;
        // Helps to smooth walk to run and vice versa, since legs can be in different positions
        // Skip ahead in the run animation
        action.time = prevAction.time * ratio;
      } else {
        action.time = 0.0;
        action.setEffectiveTimeScale(1.0);
        action.setEffectiveWeight(1.0);
      }
      
      action.crossFadeFrom(prevAction, 0.5, true);
    }
    action.play();
  }

  exit(context: IGameContext): void { console.log('run exit'); }

  update(context: IGameContext, deltaTime: number): string | null {
    if (!context.input.isMoving()) {
      return 'idle';
    }
    
    if (!context.input.isSprinting()) {
      return 'walk';
    }
    
    return null; // Stay in run
  }
}