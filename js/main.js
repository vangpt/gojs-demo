import { initDiagram } from "./diagram.js";
import { initPalette } from "./palette.js";

window.addEventListener("DOMContentLoaded", () => {
  const diagram = initDiagram();
  initPalette(diagram);
});
