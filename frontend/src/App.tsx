import React, { useState } from "react";
import CanvasComponent from "./components/CanvasComponent";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [numberDetails, setNumberDetails] = useState({
    selectedNumber: "20", // Initial number
    selectedFont: "GasoekOne.ttf", // Initial font
    selectedSize: "500", // Initial font size
  });

  // Function to update the numberDetails state
  const updateNumberDetails = (key: string, value: string) => {
    setNumberDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* Control Panel */}
      <ControlPanel
        selectedNumber={numberDetails.selectedNumber}
        selectedFont={numberDetails.selectedFont}
        selectedSize={numberDetails.selectedSize}
        updateNumberDetails={updateNumberDetails}
      />

      {/* Canvas Component */}
      <CanvasComponent
        selectedNumber={numberDetails.selectedNumber}
        selectedFont={numberDetails.selectedFont}
        selectedSize={numberDetails.selectedSize}
      />
    </div>
  );
}

export default App;
