import React from "react";

interface ControlPanelProps {
  selectedNumber: string | number;
  selectedFont: string;
  selectedSize: string | number;
  strokeWidth: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  phrase: string;
  selectedTextSize: number;
  selectedTextFont: string;
  textOffsetX: number;
  textOffsetY: number;
  textRotation: number;
  textColor: string;
  updateTextDetails: (key: string, value: string | number) => void;
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
  phrase,
  selectedTextSize,
  selectedTextFont,
  textRotation,
  textOffsetX,
  textOffsetY,
  textColor,
  updateTextDetails,
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

  const handleFontChangeText = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateTextDetails("selectedFont", value);
  };

  const handleSizeChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      updateTextDetails("selectedSize", value === "" ? "" : parseInt(value));
    }
  };

  const handlePhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateTextDetails("phrase", value);
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

  const moveText = (direction: "left" | "right" | "up" | "down") => {
    switch (direction) {
      case "left":
        updateTextDetails("textOffsetX", textOffsetX - 10);
        break;
      case "right":
        updateTextDetails("textOffsetX", textOffsetX + 10);
        break;
      case "up":
        updateTextDetails("textOffsetY", textOffsetY - 10);
        break;
      case "down":
        updateTextDetails("textOffsetY", textOffsetY + 10);
        break;
      default:
        break;
    }
  };

  const rotate = (direction: "left" | "right") => {
    const value = direction === "left" ? rotation + 1 : rotation - 1;
    updateNumberDetails("rotation", value);
  };

  const rotateText = (direction: "left" | "right") => {
    const value = direction === "left" ? textRotation + 1 : textRotation - 1;
    updateTextDetails("textRotation", value);
  };

  const reset = () => {
    updateNumberDetails("offsetX", 0);
    updateNumberDetails("offsetY", 0);
    updateNumberDetails("rotation", 0);
    updateNumberDetails("selectedNumber", 20);
    updateNumberDetails("selectedSize", 550);
    updateNumberDetails("selectedFont", "GasoekOne.ttf");
  };

  const resetText = () => {
    updateTextDetails("textOffsetX", 0);
    updateTextDetails("textOffsetY", 50);
    updateTextDetails("textRotation", 0);
    updateTextDetails("selectedSize", 90);
    updateTextDetails("phrase", "Happy Birthday");
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTextDetails("textColor", e.target.value);
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
        {/* Add more fonts */}
      </select>

      {/* New Phrase input */}
      <label htmlFor="phrase-input" style={{ marginTop: "20px" }}>
        Enter text phrase:
      </label>
      <input
        id="phrase-input"
        type="text"
        value={phrase}
        onChange={handlePhraseChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      />

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

      <button onClick={() => moveText("left")}>Move Left</button>
      <button onClick={() => moveText("right")}>Move Right</button>
      <button onClick={() => moveText("up")}>Move Up</button>
      <button onClick={() => moveText("down")}>Move Down</button>
      <button onClick={() => rotateText("left")}>Rotate Left</button>
      <button onClick={() => rotateText("right")}>Rotate Right</button>
      <button onClick={resetText}>Reset</button>

      <select
        id="font-selector"
        value={selectedTextFont}
        onChange={handleFontChangeText}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="Gasoek One">Gasoek One</option>
        <option value="Arial Black">Arial Black</option>
        <option value="Coiny">Coiny</option>
        <option value="Monsieur La Doulaise">Monsieur La Doulaise</option>
        <option value="Imperial Script">Imperial Script</option>
        {/* Add more fonts */}
      </select>

      {/* Size input */}
      <label htmlFor="size-input" style={{ marginBottom: "10px" }}>
        Choose font size:
      </label>
      <input
        id="size-input"
        type="text"
        value={selectedTextSize}
        onChange={handleSizeChangeText}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <label htmlFor="text-color" style={{ marginTop: "20px" }}>
        Text Color:
      </label>
      <input
        id="text-color"
        type="color"
        value={textColor}
        onChange={handleColorChange}
        style={{
          width: "100%",
          padding: "5px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default ControlPanel;
