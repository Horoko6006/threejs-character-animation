import * as THREE from 'three';
import type { KeyboardInput } from './keyboard-input';

// ============================================================================
// GAME CONTEXT (Shared data between states and controller)
// ============================================================================

export interface IAnimationData {
  action: THREE.AnimationAction;
  clip: THREE.AnimationClip;
}

export interface IGameContext {
  // Three.js specific
  mixer: THREE.AnimationMixer;
  animations: { [key: string]: IAnimationData };
  character: THREE.Object3D;

  // Camera
  camera: ICameraSetting;
  
  // Game state
  input: KeyboardInput;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  deceleration: THREE.Vector3;
}

export interface ICameraSetting
{
  offset: THREE.Vector3;
  lookOffset: THREE.Vector3;
  followSpeed: number;
}

// ============================================================================
// STATE STRATEGY INTERFACE
// ============================================================================

export interface IStateStrategy {
  readonly name: string;
  enter(context: IGameContext, prevState: IStateStrategy | null): void;
  exit(context: IGameContext): void;
  update(context: IGameContext, deltaTime: number): string | null;
}
