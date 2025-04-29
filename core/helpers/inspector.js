export function showInspector(diagram, part) {
  const div = document.getElementById("inspectorDiv");

  function changeColor(part) {
    if (part instanceof go.Node) {
      var shape = part.findObject("Shape");
      if (shape) {
        shape.fill = document.getElementById("colorPicker").value;
      }
    }
  }
  function changeBorderWidth(part) {
    if (part instanceof go.Node) {
      var shape = part.findObject("Shape");
      if (shape) {
        shape.strokeWidth = document.getElementById("borderWidth").value;
      }
    }
  }

  function changeBorderColor(part) {
    if (part instanceof go.Node) {
      var shape = part.findObject("Shape");
      if (shape) {
        shape.stroke = document.getElementById("borderColorPicker").value;
      }
    }
  }

  function changeBorderStyle(style) {
    if (part instanceof go.Node) {
      var shape = part.findObject("Shape");
      if (shape) {
        switch (style) {
          case "solid":
            shape.strokeDashArray = [];
            break;
          case "dash":
            shape.strokeDashArray = [4, 2];
            break;
          case "dot":
            shape.strokeDashArray = [1, 2];
            break;
        }
      }
    }
  }

  if (part instanceof go.Node) {
    const data = part.data;
    console.log("data", data);

    div.innerHTML = `
      <h4>Properties</h4>
      <p><strong>Text:</strong> ${data.text}</p>
      <div>
        <input type="color" id="colorPicker" value="${data.color}" />
      </div>
      <p>Border width</p>
      <div>
        <input type="number" id="borderWidth" value="1" min="1" />
      </div>
      <p>Border color</p>
      <div>
        <input type="color" id="borderColorPicker"  />
      </div>
      <fieldset>
        <legend>Border style:</legend>

        <div>
          <input type="radio" id="solid" name="borderStyle" value="solid" checked />
          <label for="solid">solid</label>
        </div>

        <div>
          <input type="radio" id="dash" name="borderStyle" value="dash" />
          <label for="dash">dash</label>
        </div>

        <div>
          <input type="radio" id="dot" name="borderStyle" value="dot" />
          <label for="louie">dot</label>
        </div>
      </fieldset>
    `;
    const colorPicker = document.getElementById("colorPicker");
    colorPicker.addEventListener("input", () => changeColor(part));
    window.changeColor = changeColor;

    const inputBorderElement = document.getElementById("borderWidth");
    inputBorderElement.addEventListener("change", () =>
      changeBorderWidth(part)
    );
    window.changeBorderWidth = changeBorderWidth;

    const colorBorderElement = document.getElementById("borderColorPicker");
    colorBorderElement.addEventListener("input", () => changeBorderColor(part));
    window.changeBorderColor = changeBorderColor;

    const solidBorderElement = document.getElementById("solid");
    solidBorderElement.addEventListener("click", () =>
      changeBorderStyle("solid")
    );

    const dashBorderElement = document.getElementById("dash");
    dashBorderElement.addEventListener("click", () =>
      changeBorderStyle("dash")
    );
    const dotBorderElement = document.getElementById("dot");
    dotBorderElement.addEventListener("click", () => changeBorderStyle("dot"));

    window.changeBorderStyle = changeBorderStyle;
  } else {
    div.innerHTML = "<p>Chọn 1 node để xem thông tin</p>";
  }
}
