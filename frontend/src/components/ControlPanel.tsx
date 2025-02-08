import React from "react";

interface ControlPanelProps {
  selectedNumber: string | number;
  selectedFont: string;
  selectedSize: string | number;
  offsetX: number;
  offsetY: number;
  updateNumberDetails: (key: string, value: string | number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedNumber,
  selectedFont,
  selectedSize,
  offsetX,
  offsetY,
  updateNumberDetails,
}) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    if (/^\d*$/.test(value)) {
      updateNumberDetails(
        "selectedNumber",
        value === "" ? "" : parseInt(value)
      );
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    if (/^\d*$/.test(value)) {
      updateNumberDetails("selectedSize", value === "" ? "" : parseInt(value));
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateNumberDetails("selectedFont", value);
  };

  const moveLeft = () => {
    const value = offsetX + 1;
    updateNumberDetails("offsetX", value);
  };

  const moveRight = () => {
    const value = offsetX - 1;
    updateNumberDetails("offsetX", value);
  };

  const moveUp = () => {
    const value = offsetY + 1;
    updateNumberDetails("offsetY", value);
  };

  const moveDown = () => {
    const value = offsetY - 1;
    updateNumberDetails("offsetY", value);
  };

  const center = () => {
    const value = 0;
    updateNumberDetails("offsetX", value);
    updateNumberDetails("offsetY", value);
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
        {/* Add more fonts here */}
      </select>

      <button onClick={moveLeft}>Move Left</button>
      <button onClick={moveRight}>Move Right</button>
      <button onClick={moveUp}>Move Up</button>
      <button onClick={moveDown}>Move Down</button>
      <button onClick={center}>Center</button>
    </div>
  );
};

export default ControlPanel;
