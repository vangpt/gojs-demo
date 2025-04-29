import { initDiagram } from "./diagram.js";
import { initPalette } from "./palette.js";
import { showInspector } from "./inspector.js";
import { createNodeTemplate } from "./nodeTemplates.js";

const diagrams = {};

window.addEventListener("DOMContentLoaded", () => {
  const diagram = initDiagram();
  diagrams["1"] = diagram;
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
    addCloseButton(newTab, sheetCount); // Add close button
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
    myDiagram.nodeTemplate = createNodeTemplate((node) => {
      showInspector(node.diagram, node.part);
    });
    diagrams[String(sheetCount)] = myDiagram;
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

  // Helper to get the current active sheet id
  function getActiveSheetId() {
    const activeTab = document.querySelector(".sheet-tab.active");
    if (!activeTab) return "1";
    return activeTab.id.split("-")[2];
  }

  document
    .getElementById("imageInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target.result;
        const activeSheetId = getActiveSheetId();
        const activeDiagram = diagrams[activeSheetId];
        if (activeDiagram) {
          // Add as a standalone Part, not a Node
          const $ = go.GraphObject.make;
          const imagePart = $(
            go.Part,
            "Auto",
            {
              resizable: true,
              resizeObjectName: "PICTURE",
              rotatable: true,
              angle: 0,
              locationSpot: go.Spot.Center,
            },
            $(go.Picture, {
              name: "PICTURE",
              width: 320,
              height: 320,
              source: dataUrl,
            })
          );
          activeDiagram.add(imagePart);
        }
      };
      reader.readAsDataURL(file);
    });

  const exportBtn = document.getElementById("export-json-btn");

  exportBtn.addEventListener("click", () => {
    const allData = {};
    for (const [sheetId, dia] of Object.entries(diagrams)) {
      allData[`sheet-${sheetId}`] = JSON.parse(dia.model.toJson());
    }
    const json = JSON.stringify(allData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-diagrams.json";
    a.click();
    URL.revokeObjectURL(url);
    // const json = diagram.model.toJson();
    // // Download as file
    // const blob = new Blob([json], { type: "application/json" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "diagram.json";
    // a.click();
    // URL.revokeObjectURL(url);
  });

  function addCloseButton(tab, sheetId) {
    const closeBtn = document.createElement("span");
    closeBtn.textContent = " ×";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.marginLeft = "8px";
    closeBtn.style.color = "#d35400";
    closeBtn.title = "Close tab";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Remove tab
      tab.remove();
      // Remove diagram div
      const diagramDiv = document.getElementById(`diagram-sheet-${sheetId}`);
      if (diagramDiv) diagramDiv.remove();
      // Remove from diagrams object
      delete diagrams[sheetId];
      // Activate the first tab if any left
      const firstTab = document.querySelector(".sheet-tab");
      if (firstTab) {
        setActiveTab(firstTab);
        const firstSheetId = firstTab.id.split("-")[2];
        const firstDiagramDiv = document.getElementById(
          `diagram-sheet-${firstSheetId}`
        );
        setActiveDiagram(firstDiagramDiv);
      }
    });
    tab.appendChild(closeBtn);
  }
});
