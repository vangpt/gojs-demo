import { createNodeTemplate } from "./nodeTemplates.js";
import { showInspector } from "./inspector.js";
import {
  tank1,
  tank2,
  tank3,
  pump,
  valve,
  sensor,
  colors,
  textDefaults,
} from "../constants/constants.js";

import { tankPort, statusPanel, valuesTable } from "../helpers/helper.js";

export function initDiagram() {
  const $ = go.GraphObject.make;
  const myDiagram = $(go.Diagram, "diagram-sheet-1", {
    "undoManager.isEnabled": true,
  });

  myDiagram.nodeTemplate = createNodeTemplate((node) => {
    showInspector(node.diagram, node.part);
  });

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
            portId: "",
            fromLinkable: true,
            toLinkable: true,
            cursor: "pointer",
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
    new go.Node("Vertical", { background: colors.black })
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

  myDiagram.linkTemplateMap.add(
    "",
    new go.Link({
      routing: go.Routing.AvoidsNodes,
      corner: 12,
      layerName: "Background",
      toShortLength: 3,
    })
      .bind("fromEndSegmentLength", "fromEndSeg")
      .bind("toEndSegmentLength", "toEndSeg")
      .add(
        new go.Shape({
          strokeWidth: 8,
          stroke: colors.black,
          isPanelMain: true,
        }),
        new go.Shape({
          strokeWidth: 3.5,
          stroke: colors.green,
          isPanelMain: true,
        }).bind("stroke", "color"),
        new go.Shape({
          stroke: colors.green,
          fill: colors.green,
          toArrow: "Triangle",
        })
          .bind("stroke", "color")
          .bind("fill", "color"),
        // Link label, invisible unless text is specified
        new go.Panel("Auto", { visible: false })
          .bind("visible", "text", (t) => true)
          .add(
            new go.Shape("RoundedRectangle", {
              strokeWidth: 1,
              fill: colors.gray,
            }),
            new go.TextBlock({ margin: new go.Margin(3, 1, 1, 1) })
              .set(textDefaults)
              .bind("text")
          )
      )
  );

  myDiagram.model = new go.GraphLinksModel({
    copiesArrays: true,
    copiesArrayObjects: true,
    linkFromPortIdProperty: "fromPort",
    linkToPortIdProperty: "toPort",
    nodeDataArray: [
      // TANKS
      {
        key: "Tank1",
        tankType: tank3,
        color: colors.black,
        pos: "0 200",
        ports: [
          { p: "BL1", a: new go.Spot(0, 1, 0, -50) },
          { p: "BL2", a: new go.Spot(0, 1, 0, -30) },
          { p: "BL3", a: new go.Spot(0, 1, 0, -10) },
          {
            p: "BR",
            fs: go.Spot.RightSide,
            a: new go.Spot(1, 1, 0, -30),
          },
          {
            p: "SensorR",
            type: "sensor",
            ts: go.Spot.RightSide,
            a: new go.Spot(1, 0.5, 0, 0),
          },
        ],
      },
      {
        key: "Tank2",
        color: colors.black,
        pos: "0 0",
        ports: [
          { p: "TL", a: new go.Spot(0, 0, 0, 30) },
          { p: "BR", a: new go.Spot(1, 1, 0, -50), fs: go.Spot.Right },
          { p: "B", a: new go.Spot(0.5, 1, 0, 0) },
        ],
      },
      {
        key: "Tank3",
        color: colors.black,
        tankType: tank2,
        pos: "0 400",
        width: 70,
        height: 120,
        ports: [
          { p: "TL", a: new go.Spot(0, 0, 0, 30) },
          { p: "BL", a: new go.Spot(0, 1, 0, -30) },
          {
            p: "TR",
            fs: go.Spot.RightSide,
            a: new go.Spot(1, 0, 0, 30),
          },
          {
            p: "BR",
            ts: go.Spot.RightSide,
            a: new go.Spot(1, 1, 0, -30),
          },
        ],
      },

      // MONITOR PANELS
      {
        key: "cTCV102",
        title: "Monitor TCV102",
        category: "monitor",
        pos: "600 200",
        values: [
          { label: "SV", unit: "°C", value: "12.0" },
          { label: "PV", unit: "°C", value: "12.0" },
          { label: "OP", unit: "%", value: "25.0" },
        ],
        statuses: [
          { fill: colors.green },
          { fill: colors.green },
          { fill: colors.green },
        ],
      },
      // VALVES
      {
        key: "Valve-TCV102",
        category: "valve",
        color: colors.red,
        pos: "400 400",
      },
      // PUMPS
      {
        key: "Pump-P102",
        category: "pump",
        color: colors.pink,
        pos: "400 0",
        angle: 180,
      },
      // SENSORS:
      {
        key: "S1",
        category: "sensor",
        value: "12.0",
        pos: "100 0",
        unit: "°C",
      },
    ],
    linkDataArray: [
      {
        from: "Tank1",
        to: "Tank2",
        text: "text",
        color: colors.red,
        fromPort: "BR",
        toPort: "BR",
      },
      {
        from: "Tank2",
        to: "Pump-P102",
        text: "text",
        color: colors.red,
        fromPort: "BR",
        toPort: "BR",
      },
      {
        from: "Tank2",
        to: "S1",
        text: "text",
        color: colors.red,
        fromPort: "BR",
        toPort: "BR",
      },
      {
        category: "monitor",
        from: "Pump-P102",
        to: "cTCV102",
        color: colors.yellow,
      },
      {
        from: "Tank3",
        to: "Valve-TCV102",
        text: "text",
        color: colors.yellow,
        fromPort: "BR",
        toPort: "BR",
      },
      {
        from: "Valve-TCV102",
        to: "cTCV102",
        text: "text",
        color: colors.green,
        fromPort: "BR",
        toPort: "BR",
      },
    ],
  });

  const socket = new WebSocket("ws://localhost:3000");

  socket.onopen = () => {
    console.log("Connected to server");
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received:", data.number);
    myDiagram.commit(() => {
      const controlNodes = ["cTCV102"].map((k) => myDiagram.findNodeForKey(k));
      for (const n of controlNodes) {
        const vals = n.data.statuses;
        myDiagram.model.set(
          vals[0],
          "fill",
          data.number % 2 === 0 ? colors.green : colors.white
        );
        myDiagram.model.set(
          vals[1],
          "fill",
          data.number % 2 === 1 ? colors.yellow : colors.white
        );
      }
    }, null);
  };
  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
  socket.onclose = () => {
    console.log("Disconnected from server");
  };

  return myDiagram;
}
