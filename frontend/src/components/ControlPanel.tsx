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
  textOffsetX,
  textOffsetY,
  textRotation,
  textColor,
  updateTextDetails,
  updateNumberDetails,
}) => {
  // Generic handler for input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string,
    isNumber: boolean = false,
    isText: boolean = false
  ) => {
    const value = e.target.value;
    const updateFn = isText ? updateTextDetails : updateNumberDetails;

    if (isNumber && !/^\d*$/.test(value)) return; // Restrict to digits if numeric
    updateFn(key, value === "" ? "" : isNumber ? parseInt(value) : value);
  };

  // Combined move function for both number and text
  const handleMove = (
    direction: "left" | "right" | "up" | "down",
    isText: boolean = false
  ) => {
    const updateFn = isText ? updateTextDetails : updateNumberDetails;
    const step = 10;

    // Define the updates object with proper typing
    const updates: { [key: string]: { key: string; value: number } } = {
      left: isText
        ? { key: "textOffsetX", value: textOffsetX - step }
        : { key: "offsetX", value: offsetX + step },
      right: isText
        ? { key: "textOffsetX", value: textOffsetX + step }
        : { key: "offsetX", value: offsetX - step },
      up: isText
        ? { key: "textOffsetY", value: textOffsetY - step }
        : { key: "offsetY", value: offsetY + step },
      down: isText
        ? { key: "textOffsetY", value: textOffsetY + step }
        : { key: "offsetY", value: offsetY - step },
    };

    const { key, value } = updates[direction];
    updateFn(key, value);
  };

  // Combined rotate function for both number and text
  const handleRotate = (
    direction: "left" | "right",
    isText: boolean = false
  ) => {
    const updateFn = isText ? updateTextDetails : updateNumberDetails;
    const key = isText ? "textRotation" : "rotation";
    const currentValue = isText ? textRotation : rotation;
    const value = direction === "left" ? currentValue + 1 : currentValue - 1;
    updateFn(key, value);
  };

  // Reset functions (kept separate for clarity, but could be combined if desired)
  const resetNumber = () => {
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

  const handleFontChangeText = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateTextDetails("selectedFont", value);
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

      {/* Number Input */}
      <label htmlFor="number-input" style={{ marginBottom: "10px" }}>
        Choose a number:
      </label>
      <input
        id="number-input"
        type="text"
        value={selectedNumber}
        onChange={(e) => handleInputChange(e, "selectedNumber", true)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Size Input (Number) */}
      <label htmlFor="size-input" style={{ marginBottom: "10px" }}>
        Choose font size:
      </label>
      <input
        id="size-input"
        type="text"
        value={selectedSize}
        onChange={(e) => handleInputChange(e, "selectedSize", true)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Font Selector (Number) */}
      <label htmlFor="font-selector" style={{ marginTop: "20px" }}>
        Choose a font:
      </label>
      <select
        id="font-selector"
        value={selectedFont}
        onChange={(e) => handleInputChange(e, "selectedFont")}
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
      </select>

      {/* Phrase Input */}
      <label htmlFor="phrase-input" style={{ marginTop: "20px" }}>
        Enter text phrase:
      </label>
      <input
        id="phrase-input"
        type="text"
        value={phrase}
        onChange={(e) => handleInputChange(e, "phrase", false, true)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      />

      {/* Number Controls */}
      <button onClick={() => handleMove("left")}>Move Left</button>
      <button onClick={() => handleMove("right")}>Move Right</button>
      <button onClick={() => handleMove("up")}>Move Up</button>
      <button onClick={() => handleMove("down")}>Move Down</button>
      <button onClick={() => handleRotate("left")}>Rotate Left</button>
      <button onClick={() => handleRotate("right")}>Rotate Right</button>
      <button onClick={resetNumber}>Reset</button>

      {/* Stroke Width */}
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
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* Text Controls */}
      <button onClick={() => handleMove("left", true)}>Move Left (Text)</button>
      <button onClick={() => handleMove("right", true)}>
        Move Right (Text)
      </button>
      <button onClick={() => handleMove("up", true)}>Move Up (Text)</button>
      <button onClick={() => handleMove("down", true)}>Move Down (Text)</button>
      <button onClick={() => handleRotate("left", true)}>
        Rotate Left (Text)
      </button>
      <button onClick={() => handleRotate("right", true)}>
        Rotate Right (Text)
      </button>
      <button onClick={resetText}>Reset Text</button>

      {/* Font Selector (Text) */}
      <select
        id="font-selector-text"
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
      </select>

      {/* Size Input (Text) */}
      <label htmlFor="size-input-text" style={{ marginBottom: "10px" }}>
        Choose text font size:
      </label>
      <input
        id="size-input-text"
        type="text"
        value={selectedTextSize}
        onChange={(e) => handleInputChange(e, "selectedTextSize", true, true)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Text Color */}
      <label htmlFor="text-color" style={{ marginTop: "20px" }}>
        Text Color:
      </label>
      <input
        id="text-color"
        type="color"
        value={textColor}
        onChange={(e) => handleInputChange(e, "textColor", false, true)}
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
