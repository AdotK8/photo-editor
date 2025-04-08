import { useState, useRef } from "react";
import CanvasComponent from "./components/CanvasComponent";
import ControlPanel from "./components/ControlPanel";
import ImagePanel from "./components/ImagePanel";
import Konva from "konva";
import "./styles/App.scss";

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
  const stageRef = useRef<Konva.Stage | null>(null);

  const [numberDetails, setNumberDetails] = useState({
    selectedNumber: 20,
    numberFont: "GasoekOne.ttf",
    numberSize: 550,
    strokeWidth: 2,
    numberOffsetX: 0,
    numberOffsetY: -30,
    numberRotation: 0,
    numberColor: "#000000",
  });

  const [messageDetails, setMessageDetails] = useState({
    messageContents: "Happy Birthday",
    messageFont: "Monsieur La Doulaise",
    messageSize: 90,
    messageOffsetX: 0,
    messageOffsetY: 80,
    messageRotation: 0,
    messageColor: "#000000",
  });

  const canvasSize = 800;

  const [images, setImages] = useState<CustomImageData[]>(() => {
    const img1 = new Image();
    img1.src = "/images/image1.png";
    const img2 = new Image();
    img2.src = "/images/image2.png";
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

  const imageRefs = useRef<{ [key: number]: Konva.Image | null }>({});

  const updateNumberDetails = (key: string, value: string | number) => {
    setNumberDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  };

  const updateMessageDetails = (key: string, value: string | number) => {
    setMessageDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  };

  return (
    <div className="app-container">
      <div className="desktop-only-message">
        This app is designed for desktop use only. Please open it on a desktop
        browser.
      </div>
      <div className="app-content">
        <ControlPanel
          selectedNumber={numberDetails.selectedNumber}
          numberFont={numberDetails.numberFont}
          numberSize={numberDetails.numberSize}
          strokeWidth={numberDetails.strokeWidth}
          numberOffsetX={numberDetails.numberOffsetX}
          numberOffsetY={numberDetails.numberOffsetY}
          numberRotation={numberDetails.numberRotation}
          numberColor={numberDetails.numberColor}
          messageContents={messageDetails.messageContents}
          messageSize={messageDetails.messageSize}
          messageFont={messageDetails.messageFont}
          messageOffsetX={messageDetails.messageOffsetX}
          messageOffsetY={messageDetails.messageOffsetY}
          messageRotation={messageDetails.messageRotation}
          messageColor={messageDetails.messageColor}
          updateNumberDetails={updateNumberDetails}
          updateMessageDetails={updateMessageDetails}
          setImages={setImages}
          imageRefs={imageRefs}
          stageRef={stageRef}
          canvasSize={canvasSize}
        />
        <div className="canvas-wrapper">
          <CanvasComponent
            selectedNumber={numberDetails.selectedNumber}
            numberFont={numberDetails.numberFont}
            numberSize={numberDetails.numberSize}
            strokeWidth={numberDetails.strokeWidth}
            numberOffsetX={numberDetails.numberOffsetX}
            numberOffsetY={numberDetails.numberOffsetY}
            numberRotation={numberDetails.numberRotation}
            numberColor={numberDetails.numberColor}
            messageContents={messageDetails.messageContents}
            messageSize={messageDetails.messageSize}
            messageFont={messageDetails.messageFont}
            messageOffsetX={messageDetails.messageOffsetX}
            messageOffsetY={messageDetails.messageOffsetY}
            messageRotation={messageDetails.messageRotation}
            messageColor={messageDetails.messageColor}
            images={images}
            setImages={setImages}
            imageRefs={imageRefs}
            stageRef={stageRef}
            canvasSize={canvasSize}
          />
        </div>
        <ImagePanel
          images={images}
          setImages={setImages}
          canvasSize={canvasSize}
          imageRefs={imageRefs}
        />
      </div>
    </div>
  );
}

export default App;
