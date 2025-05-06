import { createNodeTemplate } from "./nodeTemplates.js";
import { showInspector } from "./inspector.js";

export function initDiagram() {
  const $ = go.GraphObject.make;
  const myDiagram = $(go.Diagram, "diagram-sheet-1", {
    "undoManager.isEnabled": true,
  });

  myDiagram.nodeTemplate = createNodeTemplate((node) => {
    showInspector(node.diagram, node.part);
  });

  const tank1 = "F M 0 0 L 0 75 25 100 50 75 50 0z";
  const tank2 = "F M 0 0 L 0 100 10 100 10 90 40 90 40 100 50 100 50 0z";

  const tank3 = "F M 0 100 L 0 25 A 25 25 0 0 1 50 25 L 50 100 z";
  const pump = "F M 8 10 A 2 2 0 1 1 6 8 L 9 8 L 9 10 Z M 5 11 A 1 1 0 0 1 7 9";
  const valve = "F1 M0 0 L40 20 40 0 0 20z M20 10 L20 30 M12 30 L28 30";
  const sensor =
    "F M 0 0 L 15 15 L 15 20 L 5 20 L 5 15 L 0 15 L 0 10 L -2 10 L -2 4 L 0 4 Z";

  const colors = {
    black: "#151c26",
    white: "#ffffff",
    gray: "#2c323b",
    green: "#7ba961",
    blue: "#00a9b0",
    pink: "#e483a2",
    yellow: "#f9c66a",
    orange: "#e48042",
    red: "#ed2d44",
  };

  const tankPort = new go.Panel()
    .bind("alignment", "a")
    .bind("portId", "p")
    .bind("fromSpot", "fs")
    .bind("toSpot", "ts")
    .add(
      new go.Shape("Diamond", {
        width: 10,
        height: 10,
        fill: colors.white,
      })
    );

  const textDefaults = {
    font: "10px InterVariable, sans-serif",
    stroke: colors.white,
  };

  const statusPanelTemplate = new go.Panel("Spot").add(
    new go.Shape({ width: 18, height: 18, fill: colors.white }).bind("fill"),
    new go.TextBlock().set(textDefaults).bind("text")
  );
  const statusPanel = new go.Panel("Horizontal", {
    width: 90,
    height: 20,
    itemTemplate: statusPanelTemplate,
  }).bind("itemArray", "statuses");

  const valuesTableItem = new go.Panel("TableRow").add(
    new go.TextBlock("").set(textDefaults).bind("text", "label"),
    new go.Panel("Spot", { column: 1 }).add(
      new go.Shape({
        stroke: colors.orange,
        fill: colors.black,
        margin: 2,
        width: 40,
        height: 15,
      }),
      new go.TextBlock("", {}).set(textDefaults).bind("text", "value")
    ),
    new go.TextBlock("", { column: 2, alignment: go.Spot.Left })
      .set(textDefaults)
      .bind("text", "unit")
  );
  const valuesTable = new go.Panel("Table", {
    itemTemplate: valuesTableItem,
  }).bind("itemArray", "values");

  // TANKS
  myDiagram.nodeTemplateMap.add(
    "",
    // Outer spot panel holding inner spot panel (main element) and ports
    new go.Node("Spot", {
      itemTemplate: tankPort,
    })
      .bindTwoWay("location", "pos", go.Point.parse, go.Point.stringify)
      .bind("itemArray", "ports")
      .add(
        // Inner spot panel holding Shape and Text label
        new go.Panel("Spot").add(
          new go.Shape({
            geometryString: tank1,
            strokeWidth: 1,
            stroke: "gray",
            width: 75,
            height: 140,
            fill: new go.Brush("Linear", {
              0: go.Brush.darken(colors.white),
              0.2: colors.white,
              0.33: go.Brush.lighten(colors.white),
              0.5: colors.white,
              1: go.Brush.darken(colors.white),
              start: go.Spot.Left,
              end: go.Spot.Right,
            }),
          })
            .bind("width")
            .bind("height")
            .bind("geometryString", "tankType"),
          // tank label
          new go.TextBlock({
            font: "bold 13px InterVariable, sans-serif",
            stroke: colors.black,
          }).bind("text", "key")
        )
      )
  );

  // MONITORS
  myDiagram.nodeTemplateMap.add(
    "monitor",
    new go.Node("Auto")
      .bindTwoWay("location", "pos", go.Point.parse, go.Point.stringify)
      .add(
        new go.Shape({
          fill: colors.black,
          stroke: colors.white,
          strokeWidth: 2,
        }),
        new go.Panel("Vertical", { margin: 4 }).add(
          // Title
          new go.TextBlock("Title", {}).set(textDefaults).bind("text", "title"),
          // Notifications
          statusPanel,
          // Values
          valuesTable
        )
      )
  );

  myDiagram.nodeTemplateMap.add(
    "valve",
    new go.Node("Vertical", {
      locationSpot: new go.Spot(0.5, 1, 0, -21),
      locationObjectName: "SHAPE",
      selectionObjectName: "SHAPE",
      rotatable: true,
    })
      .bindTwoWay("angle")
      .bindTwoWay("location", "pos", go.Point.parse, go.Point.stringify)
      .add(
        new go.TextBlock({
          background: colors.black,
          alignment: go.Spot.Center,
          textAlign: "center",
          margin: 2,
          editable: true,
        })
          .set(textDefaults)
          .bind("text", "key")
          // keep the text upright, even when the whole node has been rotated upside down
          .bindObject("angle", "angle", (a) => (a === 180 ? 180 : 0)),
        new go.Shape({
          name: "SHAPE",
          geometryString: valve,
          strokeWidth: 2,
          portId: "",
          fromSpot: new go.Spot(1, 0.35),
          toSpot: new go.Spot(0, 0.35),
        })
          .bind("fill", "color")
          .bind("stroke", "color", (c) => go.Brush.darkenBy(c, 0.3))
      )
  );

  // VALVES
  myDiagram.nodeTemplateMap.add(
    "pump",
    new go.Node("Vertical", {
      locationSpot: new go.Spot(0.5, 1, 0, -21),
      locationObjectName: "SHAPE",
      selectionObjectName: "SHAPE",
      rotatable: true,
    })
      .bindTwoWay("angle")
      .bindTwoWay("location", "pos", go.Point.parse, go.Point.stringify)
      .add(
        new go.TextBlock({
          background: colors.black,
          alignment: go.Spot.Center,
          textAlign: "center",
          margin: 2,
          editable: true,
        })
          .set(textDefaults)
          .bind("text", "key")
          // keep the text upright, even when the whole node has been rotated upside down
          .bindObject("angle", "angle", (a) => (a === 180 ? 180 : 0)),
        new go.Shape({
          name: "SHAPE",
          geometryString: pump,
          width: 45,
          height: 40,
          strokeWidth: 2,
          portId: "",
          fromSpot: new go.Spot(1, 0.25),
          toSpot: new go.Spot(0, 0.5),
        })
          .bind("fill", "color")
          .bind("stroke", "color", (c) => Brush.darkenBy(c, 0.3))
      )
  );

  // Sensor node, linked to a tank
  myDiagram.nodeTemplateMap.add(
    "sensor",
    new go.Node("Vertical")
      .bindTwoWay("location", "pos", go.Point.parse, go.Point.stringify)
      .add(
        new go.Panel("Horizontal", { margin: 4 }).add(
          new go.Shape({
            fill: colors.black,
            stroke: colors.white,
            strokeWidth: 2,
            geometryString: sensor,
            portId: "",
            fromSpot: new go.Spot(0, 0.4, 0, 0),
          }),
          new go.TextBlock({ margin: 2 }).set(textDefaults).bind("text", "key")
        ),
        new go.Panel("Horizontal").add(
          new go.Panel("Spot", { column: 1 }).add(
            new go.Shape({
              stroke: colors.orange,
              fill: colors.black,
              margin: 2,
              width: 40,
              height: 15,
            }),
            new go.TextBlock("", {}).set(textDefaults).bind("text", "value")
          ),
          new go.TextBlock("", { column: 2, alignment: go.Spot.Left })
            .set(textDefaults)
            .bind("text", "unit")
        )
      )
  );
  // add image
  const imagePart = new go.Part("Auto", {
    resizable: true,
    resizeObjectName: "PICTURE",
    locationSpot: go.Spot.Center,
  });

  // imagePart.add(
  //   new go.Picture("../../assets/images/toeic.png", {
  //     name: "PICTURE",
  //     width: 200,
  //     height: 200,
  //   })
  // );

  myDiagram.add(imagePart);

  return myDiagram;
}
