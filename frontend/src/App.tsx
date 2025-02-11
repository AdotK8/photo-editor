import React, { useState } from "react";
import CanvasComponent from "./components/CanvasComponent";
import ControlPanel from "./components/ControlPanel";
import ImagePanel from "./components/ImagePanel";

interface ImageData {
  id: string;
  url: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

function App() {
  const [numberDetails, setNumberDetails] = useState({
    selectedNumber: 20, // Initial number
    selectedFont: "GasoekOne.ttf", // Initial font
    selectedSize: 550, // Initial font Size
    offsetX: 0, // Initial offset x-axis
    offsetY: 0, // Initial offset y-axis
    rotation: 0, // Initial rotation
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
        rotation={numberDetails.rotation}
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
          rotation={numberDetails.rotation}
        />
      </div>

      {/* Image Panel */}
      <ImagePanel />
    </div>
  );
}

export default App;
