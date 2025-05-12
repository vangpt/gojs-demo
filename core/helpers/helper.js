import { colors, textDefaults } from "../constants/constants.js";

export const tankPort = new go.Panel()
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

export const statusPanelTemplate = new go.Panel("Spot").add(
  new go.Shape({ width: 18, height: 18, fill: colors.white }).bind("fill"),
  new go.TextBlock().set(textDefaults).bind("text")
);
export const statusPanel = new go.Panel("Horizontal", {
  width: 90,
  height: 20,
  itemTemplate: statusPanelTemplate,
}).bind("itemArray", "statuses");

export const valuesTableItem = new go.Panel("TableRow").add(
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

export const valuesTable = new go.Panel("Table", {
  itemTemplate: valuesTableItem,
}).bind("itemArray", "values");
