import { CharacterControllerDemo } from "./character-controller-demo";
import "./style.css";

const app = new CharacterControllerDemo();

(async () => {
  await app.loadModelAsync("./models/toon.glb");

  animate();
})();

function animate(): void {
  requestAnimationFrame(animate);
  app.render();
}