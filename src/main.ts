import { CharacterControllerDemo } from "./character-controller-demo";
import * as THREE from "three";
import "./style.css";

const app = new CharacterControllerDemo();

(async () => {
  await app.loadModelAsync("models/toon.glb");

  animate();
})();

function animate(): void {
  requestAnimationFrame(animate);
  app.render();
}

// // src/main.ts
// import * as THREE from "three";
// import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// /**
//  * Types & small helpers
//  */
// interface AnimMap {
//   [name: string]: { clip: THREE.AnimationClip; action: THREE.AnimationAction };
// };

// interface Behavior {
//   name: string;
//   enter(prev?: Behavior | null): void;
//   exit(): void;
//   update(deltaTime: number, input: CharacterInput): void;
// }

// /**
//  * ---- Behavior (Strategy) implementations ----
//  */

// class IdleBehavior implements Behavior {
//   public name = "idel";
//   private anim?: THREE.AnimationAction;
//   constructor(private anims: AnimMap) {
//     this.anim = anims["idel"]?.action;
//   }
//   enter(prev?: Behavior | null) {
//     const cur = this.animsLookup();
//     if (!cur) return;
//     if (prev && (this.animsLookupByName(prev.name))) {
//       const prevAction = this.animsLookupByName(prev.name)!.action;
//       cur.reset();
//       cur.crossFadeFrom(prevAction, 0.5, true);
//     }
//     cur.play();
//   }
//   exit() {}
//   update(_: number, input: CharacterInput) {
//     if (input.keys.forward || input.keys.backward) {
//       // Behavior switching performed by controller
//     }
//   }
//   private animsLookup() {
//     return this.anims["idel"]?.action;
//   }
//   private animsLookupByName(name: string) {
//     return this.anims[name];
//   }
// }

// class WalkBehavior implements Behavior {
//   public name = "walk";
//   constructor(private anims: AnimMap) {}
//   enter(prev?: Behavior | null) {
//     const cur = this.anims["walk"]?.action;
//     if (!cur) return;
//     if (prev && this.anims[prev.name]) {
//       const prevAction = this.anims[prev.name].action;
//       // keep time proportion to preserve blending
//       if (prev.name === "run") {
//         const ratio = cur.getClip().duration / prevAction.getClip().duration;
//         cur.time = prevAction.time * ratio;
//       } else {
//         cur.time = 0;
//         cur.setEffectiveTimeScale(1);
//         cur.setEffectiveWeight(1);
//       }
//       cur.crossFadeFrom(prevAction, 0.5, true);
//       cur.play();
//     } else {
//       cur.play();
//     }
//   }
//   exit() {}
//   update(_: number, input: CharacterInput) {}
// }

// class RunBehavior implements Behavior {
//   public name = "run";
//   constructor(private anims: AnimMap) {}
//   enter(prev?: Behavior | null) {
//     const cur = this.anims["run"]?.action;
//     if (!cur) return;
//     if (prev && this.anims[prev.name]) {
//       const prevAction = this.anims[prev.name].action;
//       if (prev.name === "walk") {
//         const ratio = cur.getClip().duration / prevAction.getClip().duration;
//         cur.time = prevAction.time * ratio;
//       } else {
//         cur.time = 0;
//         cur.setEffectiveTimeScale(1);
//         cur.setEffectiveWeight(1);
//       }
//       cur.crossFadeFrom(prevAction, 0.5, true);
//       cur.play();
//     } else {
//       cur.play();
//     }
//   }
//   exit() {}
//   update(_: number, input: CharacterInput) {}
// }

// class DanceBehavior implements Behavior {
//   public name = "dance";
//   private finishedCb?: (ev: any) => void;
//   constructor(private anims: AnimMap) {
//     this.finishedCb = () => this.onFinished();
//   }

//   enter(prev?: Behavior | null) {
//     const cur = this.anims["dance"]?.action;
//     if (!cur) return;
//     const mixer = cur.getMixer();
//     mixer.addEventListener("finished", this.finishedCb!);

//     if (prev && this.anims[prev.name]) {
//       const prevAction = this.anims[prev.name].action;
//       cur.reset();
//       cur.setLoop(THREE.LoopOnce, 1);
//       cur.clampWhenFinished = true;
//       cur.crossFadeFrom(prevAction, 0.2, true);
//       cur.play();
//     } else {
//       cur.play();
//     }
//   }

//   private onFinished() {
//     // signal to the controller (we'll wire through a callback)
//   }

//   exit() {
//     const cur = this.anims["dance"]?.action;
//     if (!cur) return;
//     cur.getMixer().removeEventListener("finished", this.finishedCb!);
//   }

//   update(_: number, input: CharacterInput) {}
// }

// /**
//  * ---- Input handler ----
//  */
// class CharacterInput {
//   public keys = {
//     forward: false,
//     backward: false,
//     left: false,
//     right: false,
//     space: false,
//     shift: false,
//   };

//   constructor() {
//     document.addEventListener("keydown", (e) => this.onKeyDown(e));
//     document.addEventListener("keyup", (e) => this.onKeyUp(e));
//   }

//   private onKeyDown(e: KeyboardEvent) {
//     switch (e.code) {
//       case "KeyW":
//         this.keys.forward = true;
//         break;
//       case "KeyA":
//         this.keys.left = true;
//         break;
//       case "KeyS":
//         this.keys.backward = true;
//         break;
//       case "KeyD":
//         this.keys.right = true;
//         break;
//       case "Space":
//         this.keys.space = true;
//         break;
//       case "ShiftLeft":
//       case "ShiftRight":
//         this.keys.shift = true;
//         break;
//     }
//   }
//   private onKeyUp(e: KeyboardEvent) {
//     console.log(e.code);
//     switch (e.code) {
//       case "KeyW":
//         this.keys.forward = false;
//         break;
//       case "KeyA":
//         this.keys.left = false;
//         break;
//       case "KeyS":
//         this.keys.backward = false;
//         break;
//       case "KeyD":
//         this.keys.right = false;
//         break;
//       case "Space":
//         this.keys.space = false;
//         break;
//       case "ShiftLeft":
//       case "ShiftRight":
//         this.keys.shift = false;
//         break;
//     }
//   }
// }

// /**
//  * ---- Controller that uses Behavior strategy ----
//  */
// class CharacterController {
//   private params: any;
//   private deceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
//   private acceleration = new THREE.Vector3(1, 0.25, 50.0);
//   private velocity = new THREE.Vector3(0, 0, 0);

//   private animations: AnimMap = {};
//   private input = new CharacterInput();
//   private target?: THREE.Object3D;
//   private mixer?: THREE.AnimationMixer;

//   // behavior management
//   private behaviors: { [name: string]: Behavior } = {};
//   private currentBehavior?: Behavior;

//   constructor(params: { scene: THREE.Scene }) {
//     this.params = params;
//     this.init();
//   }

//   private init() {
//     // Create behaviors after animations are loaded; we keep placeholders here.
//     this.loadModelAndAnimations();
//   }

//   private setupBehaviors() {
//     // create strategy instances that reference the same animations map
//     this.behaviors["idel"] = new IdleBehavior(this.animations);
//     this.behaviors["walk"] = new WalkBehavior(this.animations);
//     this.behaviors["run"] = new RunBehavior(this.animations);
//     this.behaviors["dance"] = new DanceBehavior(this.animations);

//     // Start in idle if available
//     if (this.behaviors["idel"]) this.setBehavior("idel");
//   }

//   private setBehavior(name: string) {

//     if (this.currentBehavior && this.currentBehavior.name === name) {

//       return;
//     }
//     console.log("currentBehavior: ", this.currentBehavior);
//     console.log("this.currentBehavior.name === name", name);
//     const prev = this.currentBehavior;
//     if (prev) {
//       prev.exit();
//     }
//     const next = this.behaviors[name];
//     if (!next) {
//       console.warn("Behavior not found:", name);
//       return;
//     }
//     this.currentBehavior = next;
//     next.enter(prev ?? null);
//   }

//   private loadModelAndAnimations() {
//     // IMPORTANT: switch to a single GLTF that contains model + animations.
//     // Put your combined .glb at ./resources/zombie/character.glb (example).
//     const loader = new GLTFLoader();
//     loader.load(
//       "models/toon.glb",
//       (gltf: GLTF) => {
//         // Add the model to the scene
//         const sceneObj = gltf.scene || gltf.scenes[0];
//         sceneObj.traverse((c: any) => {
//           if ((c as THREE.Mesh).isMesh) {
//             (c as THREE.Mesh).castShadow = true;
//             (c as THREE.Mesh).receiveShadow = true;
//           }
//         });

//         this.params.scene.add(sceneObj);
//         this.target = sceneObj;
//         this.mixer = new THREE.AnimationMixer(sceneObj);

//         // Map animations by name
//         gltf.animations.forEach((clip: THREE.AnimationClip) => {
//           const action = this.mixer!.clipAction(clip);
//           this.animations[clip.name] = { clip, action };
//         });

//         // Now that animations are present, create behavior strategies
//         this.setupBehaviors();

//         // If you want to auto-start a clip (like idle), start it:
//         if (this.animations["Idel"]) {
//           this.animations["Idel"].action.play();
//         }
//       },
//       undefined,
//       (err: any) => {
//         console.error("GLTF load error:", err);
//       }
//     );
//   }

//   public update(deltaTime: number) {
//     if (!this.target) return;

//     // Update behavior transitions based on input
//     const keys = this.input.keys;
//     //console.log("character controller update method", keys);
//     // prioritize dance
//     if (keys.space) {
//       this.setBehavior("dance");
//     } else if (keys.forward || keys.backward) {
//       if (keys.shift) this.setBehavior("run");
//       else this.setBehavior("walk");
//     } else {
//       this.setBehavior("idel");
//     }

//     // Movement physics (ported from original code)
//     const velocity = this.velocity;
//     const frameDecceleration = new THREE.Vector3(
//       velocity.x * this.deceleration.x,
//       velocity.y * this.deceleration.y,
//       velocity.z * this.deceleration.z
//     );
//     frameDecceleration.multiplyScalar(deltaTime);
//     frameDecceleration.z =
//       Math.sign(frameDecceleration.z) *
//       Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

//     velocity.add(frameDecceleration);

//     const controlObject = this.target;
//     const _Q = new THREE.Quaternion();
//     const _A = new THREE.Vector3();
//     const _R = controlObject.quaternion.clone();

//     const acc = this.acceleration.clone();
//     if (this.input.keys.shift) acc.multiplyScalar(2.0);
//     if (this.currentBehavior && this.currentBehavior.name === "dance") {
//       acc.multiplyScalar(0.0);
//     }

//     if (this.input.keys.forward) {
//       velocity.z += acc.z * deltaTime;
//     }
//     if (this.input.keys.backward) {
//       velocity.z -= acc.z * deltaTime;
//     }
//     if (this.input.keys.left) {
//       _A.set(0, 1, 0);
//       _Q.setFromAxisAngle(
//         _A,
//         4.0 * Math.PI * deltaTime * this.acceleration.y
//       );
//       _R.multiply(_Q);
//     }
//     if (this.input.keys.right) {
//       _A.set(0, 1, 0);
//       _Q.setFromAxisAngle(
//         _A,
//         4.0 * -Math.PI * deltaTime * this.acceleration.y
//       );
//       _R.multiply(_Q);
//     }
//     controlObject.quaternion.copy(_R);

//     const forward = new THREE.Vector3(0, 0, 1);
//     forward.applyQuaternion(controlObject.quaternion);
//     forward.normalize();
//     const sideways = new THREE.Vector3(1, 0, 0);
//     sideways.applyQuaternion(controlObject.quaternion);
//     sideways.normalize();

//     sideways.multiplyScalar(velocity.x * deltaTime);
//     forward.multiplyScalar(velocity.z * deltaTime);

//     controlObject.position.add(forward);
//     controlObject.position.add(sideways);

//     if (this.mixer) this.mixer.update(deltaTime);

//     // Update current behavior
//     if (this.currentBehavior) {
//       this.currentBehavior.update(deltaTime, this.input);
//     }
//   }
// }

// /**
//  * ---- Demo / app ----
//  */
// class CharacterControllerDemo {
//   private renderer: THREE.WebGLRenderer;
//   private scene: THREE.Scene;
//   private camera: THREE.PerspectiveCamera;
//   private controllers?: CharacterController;
//   private mixers: THREE.AnimationMixer[] = [];
//   private previousRAF: number | null = null;

//   constructor() {
//     this.renderer = new THREE.WebGLRenderer({ antialias: true });
//     //this.renderer.outputEncoding = THREE.sRGBEncoding;
//     this.renderer.shadowMap.enabled = true;
//     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     this.renderer.setPixelRatio(window.devicePixelRatio);
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(this.renderer.domElement);

//     window.addEventListener("resize", () => this.onWindowResize(), false);

//     const fov = 60;
//     const aspect = window.innerWidth / window.innerHeight;
//     this.camera = new THREE.PerspectiveCamera(fov, aspect, 1.0, 1000.0);
//     this.camera.position.set(25, 10, 25);

//     this.scene = new THREE.Scene();

//     // lights
//     let dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
//     dirLight.position.set(-100, 100, 100);
//     dirLight.target.position.set(0, 0, 0);
//     dirLight.castShadow = true;
//     dirLight.shadow.bias = -0.001;
//     dirLight.shadow.mapSize.width = 4096;
//     dirLight.shadow.mapSize.height = 4096;
//     dirLight.shadow.camera.near = 0.1;
//     dirLight.shadow.camera.far = 500.0;
//     // bounds
//     dirLight.shadow.camera.left = 50;
//     dirLight.shadow.camera.right = -50;
//     dirLight.shadow.camera.top = 50;
//     dirLight.shadow.camera.bottom = -50;
//     this.scene.add(dirLight);

//     const amb = new THREE.AmbientLight(0xffffff, 0.25);
//     this.scene.add(amb);

//     const controls = new OrbitControls(this.camera, this.renderer.domElement);
//     controls.target.set(0, 10, 0);
//     controls.update();

//     // // environment background (optional; adjust paths)
//     // const texLoader = new THREE.CubeTextureLoader();
//     // const texture = texLoader.load([
//     //   "./resources/posx.jpg",
//     //   "./resources/negx.jpg",
//     //   "./resources/posy.jpg",
//     //   "./resources/negy.jpg",
//     //   "./resources/posz.jpg",
//     //   "./resources/negz.jpg",
//     // ]);
//     // texture.encoding = THREE.sRGBEncoding;
//     // this.scene.background = texture;

//     // ground
//     const plane = new THREE.Mesh(
//       new THREE.PlaneGeometry(100, 100, 10, 10),
//       new THREE.MeshStandardMaterial({ color: 0x808080 })
//     );
//     plane.castShadow = false;
//     plane.receiveShadow = true;
//     plane.rotation.x = -Math.PI / 2;
//     this.scene.add(plane);

//     // Create the controller (it will load model + animations internally)
//     this.controllers = new CharacterController({ scene: this.scene });

//     this.animate();
//   }

//   private onWindowResize() {
//     this.camera.aspect = window.innerWidth / window.innerHeight;
//     this.camera.updateProjectionMatrix();
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//   }

//   private animate() {
//     requestAnimationFrame((t) => {
//       if (this.previousRAF === null) this.previousRAF = t;
//       this.animate();
//       this.renderer.render(this.scene, this.camera);
//       const delta = (t - (this.previousRAF ?? t)) * 0.001;
//       this.previousRAF = t;
//       if (this.controllers) this.controllers.update(delta);
//     });
//   }
// }

// window.addEventListener("DOMContentLoaded", () => {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const app = new CharacterControllerDemo();
// });
