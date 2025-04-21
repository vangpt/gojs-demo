export function makePort(name, spot, output, input) {
  return go.GraphObject.make(go.Shape, "Circle", {
    fill: "transparent",
    stroke: null,
    desiredSize: new go.Size(8, 8),
    alignment: spot,
    alignmentFocus: spot,
    portId: name,
    fromSpot: spot,
    toSpot: spot,
    fromLinkable: output,
    toLinkable: input,
    cursor: "pointer",
    mouseEnter: (e, port) => (port.fill = "#4a90e2"),
    mouseLeave: (e, port) => (port.fill = "transparent"),
  });
}
