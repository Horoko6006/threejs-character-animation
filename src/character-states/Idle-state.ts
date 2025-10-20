import type { IGameContext, IStateStrategy } from "../shared-interfaces";

export class IdleState implements IStateStrategy {
  readonly name = 'idle';

  enter(context: IGameContext, prevState: IStateStrategy | null): void {
    const action = context.animations[this.name].action;    
    if (prevState) {
      const prevAction = context.animations[prevState.name].action;
      action.time = 0.0;
      action.enabled = true;
      action.setEffectiveTimeScale(1.0);
      action.setEffectiveWeight(1.0);


      // crossfade helps with smoothing transitions between animations  
      action.crossFadeFrom(prevAction, 0.5, true);
    }

    action.play();
  }

  exit(context: IGameContext): void { console.log('idel exit');}

  update(context: IGameContext, deltaTime: number): string | null {
    // Check input and determine next state
    if (context.input.isDancing()) {
      return 'dance';
    }
    
    if (context.input.isMoving()) {
      return 'walk';
    }
    
    return null; // Stay in idle
  }
}



  // enter(context: IGameContext, prevState: IStateStrategy | null): void {
  //   console.log('The context', context);
  //   const action = context.animations[this.name]?.action;
    
  //   if (prevState) {
  //     const prevAction = context.animations[prevState.name]?.action;
  //     if (prevAction) {
  //       action.time = 0.0;
  //       action.enabled = true;
  //       action.setEffectiveTimeScale(1.0);
  //       action.setEffectiveWeight(1.0);
  //       action.crossFadeFrom(prevAction, 0.5, true);
  //     }
  //   }
  //   console.log('The Idel action: ', action);
  //   action?.play();
  // }