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

  // add image
  const imagePart = new go.Part("Auto", {
    resizable: true,
    resizeObjectName: "PICTURE",
    locationSpot: go.Spot.Center,
  });

  imagePart.add(
    new go.Picture("../../assets/images/toeic.png", {
      name: "PICTURE",
      width: 200,
      height: 200,
    })
  );

  myDiagram.add(imagePart);

  return myDiagram;
}
