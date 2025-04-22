import { initDiagram } from "./diagram.js";
import { initPalette } from "./palette.js";

window.addEventListener("DOMContentLoaded", () => {
  const diagram = initDiagram();
  initPalette(diagram);

  let sheetCount = 1;
  const addBtn = document.getElementById("add-sheet-btn");
  const tabsContainer = document.getElementById("sheet-tabs");
  const mainDiagramElement = document.getElementById("main-diagram");
  addBtn.addEventListener("click", () => {
    sheetCount++;
    const newTab = document.createElement("div");
    newTab.className = "sheet-tab";
    newTab.id = `sheet-tab-${sheetCount}`;
    newTab.textContent = `Sheet ${sheetCount}`;
    tabsContainer.appendChild(newTab);
    setActiveTab(newTab);

    const newMainDiagram = document.createElement("div");
    newMainDiagram.id = `diagram-sheet-${sheetCount}`;
    newMainDiagram.className = "diagram-content";
    newMainDiagram.textContent = `diagram sheet ${sheetCount}`;
    mainDiagramElement.appendChild(newMainDiagram);
    setActiveDiagram(newMainDiagram);

    const $ = go.GraphObject.make;
    const myDiagram = $(go.Diagram, `diagram-sheet-${sheetCount}`, {
      "undoManager.isEnabled": true,
    });
  });
  tabsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("sheet-tab")) {
      setActiveTab(e.target);
      const sheetId = e.target.id.split("-")[2];
      const diagram = document.getElementById(`diagram-sheet-${sheetId}`);
      setActiveDiagram(diagram);
    }
  });
  function setActiveTab(tab) {
    document
      .querySelectorAll(".sheet-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  }

  function setActiveDiagram(diagram) {
    document
      .querySelectorAll(".diagram-content")
      .forEach((t) => t.classList.remove("active"));
    diagram.classList.add("active");
  }

  document
    .getElementById("imageInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target.result;
        diagram.model.addNodeData({
          source: dataUrl,
        });
      };
      reader.readAsDataURL(file);
    });
});
