import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CharacterController } from "./character-controller";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";

export class CharacterControllerDemo {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private clock: THREE.Clock;
  private characterController: CharacterController;
 
  constructor() {
    this.clock = new THREE.Clock();

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 0, 100);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      .01,
      1000
    );

    // Add lighting
    this.setupLighting();

    // Add ground plane
    this.setupGround();

    // // Setup camera controls
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.target.set(0, 0, 0);
    // controls.update();

    // Create character controller (this integrates our FSM!)
    this.characterController = new CharacterController(this.scene, this.camera);
    
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private setupLighting(): void {
    // Directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(-100, 100, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = 50;
    dirLight.shadow.camera.right = -50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    this.scene.add(dirLight);

    // Ambient light
    const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambLight);
  }

  private setupGround(): void {
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x4a7c59,
      roughness: 0.8 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const grid = new THREE.GridHelper(100, 50, 0x000000, 0x000000);
    grid.material.opacity = 0.1;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  loadModelAsync(url: string): Promise<THREE.Object3D>{
    return this.characterController.loadAsync(url);
  }

  render(){
    const deltaTime = this.clock.getDelta();
    
    // THIS IS WHERE THE MAGIC HAPPENS:
    // Character controller update calls:
    // 1. StateMachine.update() - polls input, transitions states
    // 2. AnimationMixer.update() - updates Three.js animations
    // 3. Movement/physics updates - applies velocity to character
    this.characterController.update(deltaTime);

    this.renderer.render(this.scene, this.camera);
  }
}