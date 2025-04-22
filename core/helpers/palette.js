import { createNodeTemplate } from "./nodeTemplates.js";

export function initPalette(mainDiagram) {
  const $ = go.GraphObject.make;

  const palette = $(go.Palette, "paletteDiv", {
    nodeTemplate: createNodeTemplate(() => {}),
  });

  palette.model = new go.GraphLinksModel([
    {
      color: "#e6f2ff",
      source: "../../assets/images/toeic.png",
    },
    {
      text: "Text",
      color: "#ffe6e6",
      source: "../../assets/images/toeic.png",
      tooltip: "Text",
    },
    {
      text: "Wait",
      color: "#fffbe6",
      source: "../../assets/images/toeic.png",
      tooltip: "Chờ một khoảng thời gian",
    },
    {
      text: "Condition",
      color: "#e6ffe6",
      source: "../../assets/images/toeic.png",
      tooltip: "Rẽ nhánh điều kiện",
    },
    {
      text: "End",
      color: "#f2e6ff",
      source: "../../assets/images/toeic.png",
      tooltip: "Kết thúc luồng",
    },
  ]);
}
