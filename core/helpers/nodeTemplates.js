import { makePort } from "./ports.js";

export function createNodeTemplate(onNodeSelected) {
  const $ = go.GraphObject.make;

  return $(
    go.Node,
    "Spot",
    { selectionChanged: onNodeSelected },
    $(
      go.Panel,
      "Auto",
      $(
        go.Shape,
        "RoundedRectangle",
        {
          name: "Shape",
          fill: "white",
          stroke: "#4a90e2",
          strokeWidth: 1,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
        },
        new go.Binding("fill", "color").makeTwoWay()
      ),
      $(
        go.Panel,
        "Horizontal",
        { margin: 5 },
        $(
          go.Picture,
          { width: 40, height: 40, margin: 1 },
          new go.Binding("source")
        ),
        $(
          go.TextBlock,
          { editable: true, font: "bold 14px sans-serif" },
          new go.Binding("text").makeTwoWay()
        )
      )
    ),
    makePort("T", go.Spot.Top, true, true),
    makePort("B", go.Spot.Bottom, true, true),
    makePort("L", go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, true, true),
    {
      toolTip: $(
        "ToolTip",
        $(go.TextBlock, { margin: 5 }, new go.Binding("text", "tooltip"))
      ),
    }
  );
}
