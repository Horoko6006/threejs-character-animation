import { CharacterControllerDemo } from "./character-controller-demo";
import "./style.css";

const app = new CharacterControllerDemo();

(async () => {
  await app.loadCubeBoxAsync([
      './models/space-posx.jpg',
      './models/space-negx.jpg',
      './models/space-posy.jpg',
      './models/space-negy.jpg',
      './models/space-posz.jpg',
      './models/space-negz.jpg',
  ]);
  await app.loadToonModelAsync("./models/toon.glb");
  await app.loadZoneModelAsync("./models/zone.glb");
  animate();
})();

function animate(): void {
  requestAnimationFrame(animate);
  app.render();
}

