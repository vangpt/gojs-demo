import { createNodeTemplate } from "./nodeTemplates.js";
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

import {
  tankPort,
  statusPanel,
  valuesTable,
  statusPanelTemplate,
  valuesTableItem,
} from "../helpers/helper.js";

export function initPalette(mainDiagram) {
  const $ = go.GraphObject.make;

  const palette = $(go.Palette, "paletteDiv", {
    nodeTemplate: createNodeTemplate(() => {}),
  });

  const statusPanel = new go.Panel("Horizontal", {
    width: 90,
    height: 20,
    itemTemplate: statusPanelTemplate,
  }).bind("itemArray", "statuses");

  const valuesTable = new go.Panel("Table", {
    itemTemplate: valuesTableItem,
  }).bind("itemArray", "values");

  // TANKS
  palette.nodeTemplateMap.add(
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
  palette.nodeTemplateMap.add(
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

  palette.nodeTemplateMap.add(
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
  palette.nodeTemplateMap.add(
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
  palette.nodeTemplateMap.add(
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

  // Dữ liệu thiết bị
  palette.model = new go.GraphLinksModel([
    // TANKS
    {
      key: "Tank1",
      tankType: tank3,
      color: colors.black,
      pos: "287 19",
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
      pos: "244 418",
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
      pos: "297 261",
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
    {
      key: "Tank4",
      color: colors.black,
      pos: "529 370",
      width: 60,
      height: 80,
      ports: [
        { p: "T1", a: new go.Spot(0, 0, 10, 0), ts: go.Spot.Top },
        { p: "T2", a: new go.Spot(0, 0, 30, 0), ts: go.Spot.Top },
        { p: "T3", a: new go.Spot(0, 0, 50, 0), ts: go.Spot.Top },
        { p: "B", a: new go.Spot(0.5, 1, 0, 0), fs: go.Spot.Bottom },
      ],
    },
    // MONITOR PANELS
    {
      key: "cTCV102",
      title: "Monitor TCV102",
      category: "monitor",
      pos: "32 35",
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
      key: "TCV102",
      category: "valve",
      color: colors.red,
      pos: "197 130",
    },
    // PUMPS
    {
      key: "P102",
      category: "pump",
      color: colors.pink,
      pos: "720 605.3",
      angle: 180,
    },
    // SENSORS:
    {
      key: "S1",
      category: "sensor",
      value: "12.0",
      pos: "385 68",
      unit: "°C",
    },
  ]);

  // palette.model = new go.GraphLinksModel([
  //   {
  //     color: "#e6f2ff",
  //     source: "../../assets/images/toeic.png",
  //   },
  //   {
  //     text: "Text",
  //     color: "#ffe6e6",
  //     source: "../../assets/images/toeic.png",
  //     tooltip: "Text",
  //   },
  //   {
  //     text: "Wait",
  //     color: "#fffbe6",
  //     source: "../../assets/images/toeic.png",
  //     tooltip: "Chờ một khoảng thời gian",
  //   },
  //   {
  //     text: "Condition",
  //     color: "#e6ffe6",
  //     source: "../../assets/images/toeic.png",
  //     tooltip: "Rẽ nhánh điều kiện",
  //   },
  //   {
  //     text: "End",
  //     color: "#f2e6ff",
  //     source: "../../assets/images/toeic.png",
  //     tooltip: "Kết thúc luồng",
  //   },
  // ]);
}
