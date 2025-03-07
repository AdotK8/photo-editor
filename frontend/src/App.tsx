import React, { useState } from "react";
import CanvasComponent from "./components/CanvasComponent";
import ControlPanel from "./components/ControlPanel";
import ImagePanel from "./components/ImagePanel";

export interface CustomImageData {
  id: number;
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
  flipped: boolean;
  scaleX: number;
}

function App() {
  //initial number details
  const [numberDetails, setNumberDetails] = useState({
    selectedNumber: 20,
    selectedFont: "GasoekOne.ttf",
    selectedSize: 550,
    strokeWidth: 2,
    offsetX: 0,
    offsetY: -30,
    rotation: 0,
  });

  const [textDetails, setTextDetails] = useState({
    phrase: "Happy Birthday",
    selectedFont: "Monsieur La Doulaise",
    selectedSize: 90,
    textOffsetX: 0,
    textOffsetY: 80,
    textRotation: 0,
    textColor: "#FF0000",
  });

  const canvasSize = 800;

  const [images, setImages] = useState<CustomImageData[]>(() => {
    const img1 = new Image();
    img1.src = "/images/image1.png";
    const img2 = new Image();
    img2.src = "/images/image2.png";
    const img3 = new Image();
    img3.src = "/images/image3.png";
    return [
      {
        id: 1,
        image: img1,
        x: canvasSize / 2 - 100,
        y: canvasSize / 2 - 50,
        width: 200,
        height: 100,
        selected: false,
        scaleX: 1,
        flipped: false,
      },
      {
        id: 2,
        image: img2,
        x: canvasSize / 2 - 200,
        y: canvasSize / 2 - 150,
        width: 200,
        height: 100,
        selected: false,
        scaleX: 1,
        flipped: false,
      },
    ];
  });

  // Function to update both number and font
  const updateNumberDetails = (key: string, value: string | number) => {
    setNumberDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  };

  const updateTextDetails = (key: string, value: string | number) => {
    setTextDetails((prevDetails) => ({
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
        strokeWidth={numberDetails.strokeWidth}
        offsetX={numberDetails.offsetX}
        offsetY={numberDetails.offsetY}
        rotation={numberDetails.rotation}
        phrase={textDetails.phrase}
        selectedTextSize={textDetails.selectedSize}
        selectedTextFont={textDetails.selectedFont}
        textOffsetX={textDetails.textOffsetX}
        textOffsetY={textDetails.textOffsetY}
        textRotation={textDetails.textRotation}
        textColor={textDetails.textColor}
        updateNumberDetails={updateNumberDetails}
        updateTextDetails={updateTextDetails}
      />

      {/* Canvas */}
      <div style={{ flexGrow: 1 }}>
        <CanvasComponent
          selectedNumber={numberDetails.selectedNumber}
          selectedFont={numberDetails.selectedFont}
          selectedSize={numberDetails.selectedSize}
          strokeWidth={numberDetails.strokeWidth}
          offsetX={numberDetails.offsetX}
          offsetY={numberDetails.offsetY}
          rotation={numberDetails.rotation}
          phrase={textDetails.phrase}
          selectedTextSize={textDetails.selectedSize}
          selectedTextFont={textDetails.selectedFont}
          textOffsetX={textDetails.textOffsetX}
          textOffsetY={textDetails.textOffsetY}
          textRotation={textDetails.textRotation}
          images={images}
          textColor={textDetails.textColor}
          setImages={setImages}
        />
      </div>

      {/* Image Panel */}
      <ImagePanel
        images={images}
        setImages={setImages}
        canvasSize={canvasSize}
      />
    </div>
  );
}

export default App;
