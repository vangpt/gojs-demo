import { createNodeTemplate } from "./nodeTemplates.js";
import { nodeDataArray } from "./data.js";
import { showInspector } from "./inspector.js";

export function initDiagram() {
  const $ = go.GraphObject.make;
  const myDiagram = $(go.Diagram, "diagram-sheet-1", {
    "undoManager.isEnabled": true,
  });

  myDiagram.nodeTemplate = createNodeTemplate((node) => {
    showInspector(node.diagram, node.part);
  });

  myDiagram.model = new go.GraphLinksModel(nodeDataArray);

  return myDiagram;
}
