import {
  CubeTexture,
  CubeTextureLoader,
  type Scene,
} from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

export class BackgroundController {
  readonly scene: Scene;
  private loader: CubeTextureLoader;

  constructor(scene: Scene) {
    this.scene = scene;
    this.loader = new CubeTextureLoader();
  }

  public async loadAsync(urls: string[]): Promise<void> {
    const cubeTexture: CubeTexture = await this.loader.loadAsync(urls);
    this.scene.background = cubeTexture;
  }
}
