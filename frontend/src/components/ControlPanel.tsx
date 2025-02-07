import React from "react";

interface ControlPanelProps {
  selectedNumber: string;
  selectedFont: string;
  selectedSize: string;
  updateNumberDetails: (key: string, value: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedNumber,
  selectedFont,
  selectedSize,
  updateNumberDetails,
}) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    if (/^\d*$/.test(value)) {
      updateNumberDetails("selectedNumber", value);
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    if (/^\d*$/.test(value)) {
      updateNumberDetails("selectedSize", value);
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateNumberDetails("selectedFont", value);
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
    </div>
  );
};

export default ControlPanel;
