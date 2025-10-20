interface IInputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
  shift: boolean;
}

export class KeyboardInput {
  public inputState: IInputState;

  constructor() {
    this.inputState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    this.setupListeners();
  }

  private setupListeners(): void {
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
  }

  private onKeyDown(e: KeyboardEvent): void {
    console.log(e.code);
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW': this.inputState.forward = true; break;
      case 'ArrowLeft':
      case 'KeyA': this.inputState.left = true; break;
      case 'ArrowDown':
      case 'KeyS': this.inputState.backward = true; break;
      case 'ArrowRight':
      case 'KeyD': this.inputState.right = true; break;
      case 'Space': this.inputState.space = true; break;
      case 'ShiftLeft':
      case 'ShiftRight': this.inputState.shift = true; break;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW': this.inputState.forward = false; break;
      case 'ArrowLeft':
      case 'KeyA': this.inputState.left = false; break;
      case 'ArrowDown':
      case 'KeyS': this.inputState.backward = false; break;
      case 'ArrowRight':
      case 'KeyD': this.inputState.right = false; break;
      case 'Space': this.inputState.space = false; break;
      case 'ShiftLeft':
      case 'ShiftRight': this.inputState.shift = false; break;
    }
  }

  isMoving(): boolean {
    return this.inputState.forward;// || this.inputState.backward;
  }

  isSprinting(): boolean {
    return this.isMoving() && this.inputState.shift;
  }

  isDancing(): boolean {
    return this.inputState.space;
  }
}