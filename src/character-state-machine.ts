import { DanceState } from "./character-states/dance-state";
import { IdleState } from "./character-states/Idle-state";
import { RunState } from "./character-states/run-state";
import type { IGameContext, IStateStrategy } from "./shared-interfaces";
import { WalkState } from "./character-states/walk-state";

// Class to keep track of what state the character is in.
export class CharacterStateMachine {
  private states: Map<string, IStateStrategy> = new Map();
  private currentState: IStateStrategy | null = null;
  private context: IGameContext;

  constructor(context: IGameContext) {
    this.context = context;
    this.initializeStates();
  }

  private initializeStates(): void {
    this.addState(new IdleState());
    this.addState(new WalkState());
    this.addState(new RunState());
    this.addState(new DanceState());
  }

  private addState(state: IStateStrategy): void {
    this.states.set(state.name, state);
  }

  setState(stateName: string): void {
    const newState = this.states.get(stateName);
    if (!newState) {
      throw(`State ${stateName} not found`);
    }

    // State is same, don't do anything
    if (this.currentState?.name === stateName) {
      return;
    }

    const prevState = this.currentState;
    
    // If there was a previous state, let it know we left.
    if(prevState) {
      // Give it a chance to clean up
      prevState.exit(this.context);
    }
    
    this.currentState = newState;
    this.currentState.enter(this.context, prevState);
  }

  // THIS IS THE KEY METHOD - Called every frame from Three.js render loop
  update(deltaTime: number): void {
    if (!this.currentState) {
        return;
    } 

    const nextState = this.currentState.update(this.context, deltaTime);
    if (nextState) {
      this.setState(nextState);
    }
  }

  getCurrentState(): string | null {
    return this.currentState?.name ?? null;
  }
}