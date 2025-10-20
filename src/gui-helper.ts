import * as THREE from "three";
import type { CharacterStateMachine } from "./character-state-machine";
import type { IGameContext } from "./shared-interfaces";

export class GuiHelper {
  private gameContext: IGameContext;
  private characterStateMachine: CharacterStateMachine;
  private guiContainer: HTMLDivElement;
  private stateInfo!: HTMLDivElement;

  constructor(
    gameContext: IGameContext,
    characterStateMachine: CharacterStateMachine
  ) {
    this.gameContext = gameContext;
    this.characterStateMachine = characterStateMachine;

    this.guiContainer = document.createElement("div");
    this.setupContainer();
    this.buildGUI();
    this.updateStateInfo();
  }

  /** Returns the GUI DOM element to attach to the page */
  public get element(): HTMLDivElement {
    return this.guiContainer;
  }

  /** Initialize container styling */
  private setupContainer(): void {
    Object.assign(this.guiContainer.style, {
      position: "absolute",
      top: "20px",
      right: "20px",
      background: "rgba(0, 0, 0, 0.8)",
      padding: "20px",
      borderRadius: "10px",
      fontFamily: "monospace",
      color: "white",
      minWidth: "250px",
      maxHeight: "80vh",
      overflowY: "auto",
    });
  }

  /** Build all GUI sections */
  private buildGUI(): void {
    this.guiContainer.appendChild(this.createTitle("⚙️ Controls"));

    this.stateInfo = this.createInfo();
    this.guiContainer.appendChild(this.stateInfo);

    // === Physics ===

    // === Movement ===
    this.guiContainer.appendChild(this.createSection("Movement"));
    this.guiContainer.appendChild(
      this.createVector3Slider(
        "Base Speed",
        this.gameContext.acceleration,
        -10,
        100,
        0.5
      )
    );

    // // === Camera ===
    this.guiContainer.appendChild(this.createSection('Camera'));
    this.guiContainer.appendChild(this.createVector3Slider('Offset', this.gameContext.camera.offset, -20, 20, 0.5));

    // // === Visual ===

    // // === Actions ===
    this.guiContainer.appendChild(this.createSection('Actions'));
    this.guiContainer.appendChild(this.createButton('Reset Position', () => {
      this.gameContext.character.position.set(0, 0, 0);
    }));
  }

  // -----------------------------
  // DOM Helper Methods
  // -----------------------------
  private createVector3Slider(
    label: string,
    vector: THREE.Vector3,
    min: number,
    max: number,
    step = 0.1
  ): HTMLDivElement {
    const container = document.createElement("div");
    container.style.marginBottom = "15px";

    const header = document.createElement("div");
    header.textContent = label;
    Object.assign(header.style, {
      marginBottom: "5px",
      fontSize: "12px",
      color: "#aaa",
    });
    container.appendChild(header);

    const axes: Array<"x" | "y" | "z"> = ["x", "y", "z"];

    for (const axis of axes) {
      const axisContainer = document.createElement("div");
      axisContainer.style.marginBottom = "5px";

      const axisLabel = document.createElement("span");
      axisLabel.textContent = `${axis.toUpperCase()}: `;
      Object.assign(axisLabel.style, { fontSize: "11px", color: "#ccc" });
      axisContainer.appendChild(axisLabel);

      const valueDisplay = document.createElement("span");
      valueDisplay.textContent = vector[axis].toFixed(2);
      Object.assign(valueDisplay.style, { float: "right", color: "#4fc3f7" });
      axisContainer.appendChild(valueDisplay);

      const slider = document.createElement("input");
      Object.assign(slider, {
        type: "range",
        min: String(min),
        max: String(max),
        step: String(step),
        value: String(vector[axis]),
      });
      Object.assign(slider.style, { width: "100%", cursor: "pointer" });

      slider.addEventListener("input", (e: Event) => {
        const target = e.target as HTMLInputElement;
        vector[axis] = parseFloat(target.value);
        valueDisplay.textContent = vector[axis].toFixed(2);
      });

      axisContainer.appendChild(slider);
      container.appendChild(axisContainer);
    }

    return container;
  }

  private createSlider<T extends Record<string, number>>(
    label: string,
    obj: T,
    prop: keyof T,
    min: number,
    max: number,
    step = 0.1
  ): HTMLDivElement {
    const container = document.createElement("div");
    container.style.marginBottom = "15px";

    const labelEl = document.createElement("div");
    labelEl.textContent = label;
    Object.assign(labelEl.style, {
      marginBottom: "5px",
      fontSize: "12px",
      color: "#aaa",
    });

    const valueDisplay = document.createElement("span");
    valueDisplay.textContent = obj[prop].toFixed(2);
    Object.assign(valueDisplay.style, { float: "right", color: "#4fc3f7" });
    labelEl.appendChild(valueDisplay);

    const slider = document.createElement("input");
    Object.assign(slider, {
      type: "range",
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(obj[prop]),
    });
    Object.assign(slider.style, { width: "100%", cursor: "pointer" });

    slider.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      obj[prop] = parseFloat(target.value) as T[keyof T];
      valueDisplay.textContent = (obj[prop] as number).toFixed(2);
    });

    container.append(labelEl, slider);
    return container;
  }

  private createColorPicker(label: string, mesh: THREE.Mesh): HTMLDivElement {
    const container = document.createElement("div");
    container.style.marginBottom = "15px";

    const labelEl = document.createElement("div");
    labelEl.textContent = label;
    Object.assign(labelEl.style, {
      marginBottom: "5px",
      fontSize: "12px",
      color: "#aaa",
    });

    const colorInput = document.createElement("input");
    Object.assign(colorInput, {
      type: "color",
      value: `#${(
        mesh.material as THREE.MeshStandardMaterial
      ).color.getHexString()}`,
    });
    Object.assign(colorInput.style, {
      width: "100%",
      height: "30px",
      cursor: "pointer",
      border: "none",
      borderRadius: "5px",
    });

    colorInput.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      (mesh.material as THREE.MeshStandardMaterial).color.set(target.value);
    });

    container.append(labelEl, colorInput);
    return container;
  }

  private createSection(title: string): HTMLDivElement {
    const section = document.createElement("div");
    section.textContent = title;
    section.style.cssText = `
      font-weight: bold;
      font-size: 14px;
      margin: 20px 0 10px 0;
      padding-bottom: 5px;
      border-bottom: 1px solid #444;
      color: #fff;
    `;
    if (title === "Character Controls") {
      section.style.marginTop = "0";
    }
    return section;
  }

  private createButton(label: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.cssText = `
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      background: #4fc3f7;
      color: black;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-family: monospace;
      font-weight: bold;
      font-size: 12px;
    `;
    button.addEventListener(
      "mouseenter",
      () => (button.style.background = "#6dd5ff")
    );
    button.addEventListener(
      "mouseleave",
      () => (button.style.background = "#4fc3f7")
    );
    button.addEventListener("click", onClick);
    return button;
  }

  private createInfo(): HTMLDivElement {
    const info = document.createElement("div");
    info.style.cssText = `
      font-size: 11px;
      color: #4fc3f7;
      background: rgba(79, 195, 247, 0.1);
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
    `;
    return info;
  }

  private createTitle(text: string): HTMLDivElement {
    const title = document.createElement("div");
    title.textContent = text;
    Object.assign(title.style, {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#4fc3f7",
    });
    return title;
  }

  public updateStateInfo(): void {
    const state = this.characterStateMachine.getCurrentState();
    this.stateInfo.innerHTML = `
      <strong>Current State:</strong> ${state}<br>
      <strong>Position:</strong> ${this.gameContext.character?.position.x.toFixed(
        1
      )}, 
      ${this.gameContext.character?.position.y.toFixed(1)}, 
      ${this.gameContext.character?.position.z.toFixed(1)}
    `;
  }
}
