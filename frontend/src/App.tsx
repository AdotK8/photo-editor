import React, { useState } from "react";
import CanvasComponent from "./components/CanvasComponent";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [numberDetails, setNumberDetails] = useState({
    selectedNumber: 20, // Initial number
    selectedFont: "GasoekOne.ttf", // Initial font
    selectedSize: 550, // Initial font Size
    offsetX: 0, // Initial offset x-axis
    offsetY: 0, // Initial offset y-axis
  });

  // Function to update both number and font
  const updateNumberDetails = (key: string, value: string | number) => {
    setNumberDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Control Panel */}
      <ControlPanel
        selectedNumber={numberDetails.selectedNumber}
        selectedFont={numberDetails.selectedFont}
        selectedSize={numberDetails.selectedSize}
        offsetX={numberDetails.offsetX}
        offsetY={numberDetails.offsetY}
        updateNumberDetails={updateNumberDetails}
      />

      {/* Canvas */}
      <div style={{ flexGrow: 1 }}>
        <CanvasComponent
          selectedNumber={numberDetails.selectedNumber}
          selectedFont={numberDetails.selectedFont}
          selectedSize={numberDetails.selectedSize}
          offsetX={numberDetails.offsetX}
          offsetY={numberDetails.offsetY}
        />
      </div>
    </div>
  );
}

export default App;
