import * as THREE from "three";
import type { IGameContext } from "./shared-interfaces";
import { CharacterStateMachine } from "./character-state-machine";
import { KeyboardInput } from "./keyboard-input";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CameraController } from "./camera-controller";
import { GuiHelper } from "./gui-helper";

export class CharacterController {
  private context: IGameContext;
  private stateMachine: CharacterStateMachine;
  readonly camera: THREE.PerspectiveCamera;
  private cameraCtrl!: CameraController;
  private helper!: GuiHelper;
  private loader: GLTFLoader;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    // Initialize context with placeholder values
    this.context = {
      mixer: null as any, // Will be set when model loads
      animations: {},
      character: null as any, // Will be set when model loads
      camera: {
        offset: new THREE.Vector3(0, 5, -10),
        lookOffset: new THREE.Vector3(0, 1, 0),
        followSpeed: 5,
      },
      input: new KeyboardInput(),
      velocity: new THREE.Vector3(0, 0, 0),
      acceleration: new THREE.Vector3(0.05, 0.25, 20.0),
      deceleration: new THREE.Vector3(-0.0005, -0.0001, -5.0),
    };

    this.scene = scene;
    this.camera = camera;

    this.stateMachine = new CharacterStateMachine(this.context);
    this.loader = new GLTFLoader();
  }

  public async loadAsync(url:string): Promise<THREE.Object3D> {
    const gltf: GLTF = await this.loader.loadAsync(url);
    const gltfScene = gltf.scene;
    gltfScene.position.set(0,0,0);
    gltfScene.scale.setScalar(1);
    gltfScene.traverse((callback: THREE.Object3D<THREE.Object3DEventMap>) => {
        callback.castShadow = true;
    });
    
    this.context.character = gltfScene;
    this.context.mixer = new THREE.AnimationMixer(gltfScene);
    this.scene.add(gltfScene);

    // Load animations
    this.loadAnimations(gltf);

    // Set the state machine's starting point
    this.stateMachine.setState("idle");

    this.cameraCtrl = new CameraController(this.camera, this.context);
    this.helper = new GuiHelper(this.context, this.stateMachine);
    document.body.appendChild(this.helper.element);

    return gltfScene;
  }

  private loadAnimations(gltf: GLTF): void {
    // Animation names mapping
    // Mapping the states we have to the animations we have
    const animationMap: { [key: string]: string } = {
      idle: "Idel", // Map state name to GLTF animation name
      walk: "Walk",
      run: "Run",
      dance: "Dance",
    };

    // Process all animations from the GLTF file
    gltf.animations.forEach((clip: THREE.AnimationClip) => {
      // Find which state this animation belongs to
      const stateName = Object.keys(animationMap).find(
        (key) => animationMap[key] === clip.name
      );

      if (stateName) {
        const action = this.context.mixer.clipAction(clip);

        this.context.animations[stateName] = {
          clip: clip,
          action: action,
        };
      }
    });

    // Debug helper
    const requiredAnims = Object.keys(animationMap);
    const loadedAnims = Object.keys(this.context.animations);
    const missingAnims = requiredAnims.filter(
      (anim) => !loadedAnims.includes(anim)
    );

    if (missingAnims.length > 0) {
      console.warn(`Missing animations: ${missingAnims.join(", ")}`);
      console.log(
        "Available animations:",
        gltf.animations.map((a: any) => a.name)
      );
    }
  }

  // THIS IS CALLED FROM THE THREE.JS RENDER LOOP
  update(deltaTime: number): void {

    // 1. Update state machine (handles animation transitions)
    this.stateMachine.update(deltaTime);

    // 2. Update Three.js animation mixer
    this.context.mixer.update(deltaTime);

    // 3. Apply physics/movement
    this.updateMovement(deltaTime);

    // 4. Helper
    this.helper?.updateStateInfo();
  }

  private updateMovement(deltaTime: number): void {
    const character = this.context.character;
    const input = this.context.input;
    const velocity = this.context.velocity;

    // Apply deceleration
    const frameDeceleration = new THREE.Vector3(
      velocity.x * this.context.deceleration.x,
      velocity.y * this.context.deceleration.y,
      velocity.z * this.context.deceleration.z
    );
    frameDeceleration.multiplyScalar(deltaTime);
    frameDeceleration.z =
      Math.sign(frameDeceleration.z) *
      Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z));

    velocity.add(frameDeceleration);

    // Get acceleration multiplier
    const acc = this.context.acceleration.clone();
    if (input.inputState.shift) {
      acc.multiplyScalar(2.0);
    }

    // Don't move during dance
    // if (this.stateMachine.getCurrentState() === 'dance') {
    //   acc.multiplyScalar(0.0);
    // }

    // Apply forward/backward movement
    if (input.inputState.forward) {
      velocity.z += acc.z * deltaTime;
    }
    if (input.inputState.backward) {
      velocity.z -= acc.z * deltaTime;
    }

    // Apply rotation
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = character.quaternion.clone();

    if (input.inputState.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(
        _A,
        4.0 * Math.PI * deltaTime * this.context.acceleration.y
      );
      _R.multiply(_Q);
    }
    if (input.inputState.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(
        _A,
        4.0 * -Math.PI * deltaTime * this.context.acceleration.y
      );
      _R.multiply(_Q);
    }

    character.quaternion.copy(_R);

    // Apply velocity to position
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(character.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(character.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * deltaTime);
    forward.multiplyScalar(velocity.z * deltaTime);

    character.position.add(forward);
    character.position.add(sideways);
    this.cameraCtrl.update(deltaTime, character.position);
  }
}