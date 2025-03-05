import React from "react";

interface ControlPanelProps {
  selectedNumber: string | number;
  selectedFont: string;
  selectedSize: string | number;
  strokeWidth: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  updateNumberDetails: (key: string, value: string | number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedNumber,
  selectedFont,
  selectedSize,
  strokeWidth,
  offsetX,
  offsetY,
  rotation,
  updateNumberDetails,
}) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      updateNumberDetails(
        "selectedNumber",
        value === "" ? "" : parseInt(value)
      );
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      updateNumberDetails("selectedSize", value === "" ? "" : parseInt(value));
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateNumberDetails("selectedFont", value);
  };

  const move = (direction: "left" | "right" | "up" | "down") => {
    switch (direction) {
      case "left":
        updateNumberDetails("offsetX", offsetX + 10);
        break;
      case "right":
        updateNumberDetails("offsetX", offsetX - 10);
        break;
      case "up":
        updateNumberDetails("offsetY", offsetY + 10);
        break;
      case "down":
        updateNumberDetails("offsetY", offsetY - 10);
        break;
      default:
        break;
    }
  };

  const rotate = (direction: "left" | "right") => {
    const value = direction === "left" ? rotation + 1 : rotation - 1;
    updateNumberDetails("rotation", value);
  };

  const reset = () => {
    updateNumberDetails("offsetX", 0);
    updateNumberDetails("offsetY", 0);
    updateNumberDetails("rotation", 0);
    updateNumberDetails("selectedNumber", 20);
    updateNumberDetails("selectedSize", 550);
    updateNumberDetails("selectedFont", "GasoekOne.ttf");
  };

  return (
    <div
      style={{
        width: "250px",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        borderRight: "2px solid #ddd",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h3>Control Panel</h3>

      {/* Number input */}
      <label htmlFor="number-input" style={{ marginBottom: "10px" }}>
        Choose a number:
      </label>
      <input
        id="number-input"
        type="text"
        value={selectedNumber}
        onChange={handleNumberChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Size input */}
      <label htmlFor="size-input" style={{ marginBottom: "10px" }}>
        Choose font size:
      </label>
      <input
        id="size-input"
        type="text"
        value={selectedSize}
        onChange={handleSizeChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Font selector */}
      <label htmlFor="font-selector" style={{ marginTop: "20px" }}>
        Choose a font:
      </label>
      <select
        id="font-selector"
        value={selectedFont}
        onChange={handleFontChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="GasoekOne.ttf">Gasoek One</option>
        <option value="arial_black.ttf">Arial Black</option>
        <option value="Coiny-Regular.ttf">Coiny</option>
        {/* Add more fonts*/}
      </select>

      <button onClick={() => move("left")}>Move Left</button>
      <button onClick={() => move("right")}>Move Right</button>
      <button onClick={() => move("up")}>Move Up</button>
      <button onClick={() => move("down")}>Move Down</button>
      <button onClick={() => rotate("left")}>Rotate Left</button>
      <button onClick={() => rotate("right")}>Rotate Right</button>
      <button onClick={reset}>Reset</button>
      <label htmlFor="stroke-width" style={{ marginTop: "20px" }}>
        Stroke Width:
      </label>
      <input
        id="stroke-width"
        type="range"
        min="1"
        max="10"
        value={strokeWidth}
        onChange={(e) =>
          updateNumberDetails("strokeWidth", parseInt(e.target.value))
        }
        style={{
          width: "100%",
          marginBottom: "10px",
        }}
      />
    </div>
  );
};

export default ControlPanel;
