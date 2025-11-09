import type {
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
} from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

export class ZoneController {
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  private loader: GLTFLoader;

  constructor(scene: Scene, camera: PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
    this.loader = new GLTFLoader();
  }

  public async loadAsync(url: string): Promise<Object3D> {
    const gltf: GLTF = await this.loader.loadAsync(url);
    const gltfScene = gltf.scene;
    gltfScene.position.set(0, 1, 0);
    gltfScene.scale.setScalar(45);
    gltfScene.traverse((callback: Object3D<Object3DEventMap>) => {
      callback.castShadow = true;
    });

    this.scene.add(gltfScene);

    return gltfScene;
  }
}
