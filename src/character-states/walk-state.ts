import type { IGameContext, IStateStrategy } from "../shared-interfaces";

export class WalkState implements IStateStrategy {
  readonly name = 'walk';

  enter(context: IGameContext, prevState: IStateStrategy | null): void {
    const action = context.animations[this.name].action;
    
    if (prevState) {
      const prevAction = context.animations[prevState.name].action;
      
      action.enabled = true;
      // Sync animation time when transitioning from run
      if (prevState.name === 'run') {
        const ratio = action.getClip().duration / prevAction.getClip().duration;
        // Helps to smooth walk to run and vice versa, since legs can be in different positions
        // Skip ahead in the walking animation
        action.time = prevAction.time * ratio; 
      } else {
        action.time = 0.0;
        action.setEffectiveTimeScale(1.0);
        action.setEffectiveWeight(1.0);
      }
      action.crossFadeFrom(prevAction, 0.2, true);
    }
    action.play();
  }

  exit(context: IGameContext): void { console.log('walk exit'); }

  update(context: IGameContext, deltaTime: number): string | null {
    if (!context.input.isMoving()) {
      return 'idle';
    }
    
    if (context.input.isSprinting()) {
      return 'run';
    }
    
    return null; // Stay in walk
  }
}