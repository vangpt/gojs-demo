import { createNodeTemplate } from "./nodeTemplates.js";

export function initPalette(mainDiagram) {
  const $ = go.GraphObject.make;

  const palette = $(go.Palette, "paletteDiv", {
    nodeTemplate: createNodeTemplate(() => {}),
  });

  palette.model = new go.GraphLinksModel([
    {
      text: "Email",
      color: "#e6f2ff",
      source: "https://img.icons8.com/ios/50/000000/email.png",
      tooltip: "Gửi email",
    },
    {
      text: "SMS",
      color: "#ffe6e6",
      source: "https://img.icons8.com/ios/50/000000/sms.png",
      tooltip: "Gửi SMS",
    },
    {
      text: "Wait",
      color: "#fffbe6",
      source: "https://img.icons8.com/ios/50/000000/hourglass--v1.png",
      tooltip: "Chờ một khoảng thời gian",
    },
    {
      text: "Condition",
      color: "#e6ffe6",
      source: "https://img.icons8.com/ios/50/000000/decision.png",
      tooltip: "Rẽ nhánh điều kiện",
    },
    {
      text: "End",
      color: "#f2e6ff",
      source: "https://img.icons8.com/ios/50/000000/stop.png",
      tooltip: "Kết thúc luồng",
    },
  ]);
}
