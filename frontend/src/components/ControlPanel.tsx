import React from "react";
import Konva from "konva";
import { CustomImageData } from "../App";
import { jsPDF } from "jspdf";

interface ControlPanelProps {
  selectedNumber: string | number;
  numberFont: string;
  numberSize: string | number;
  strokeWidth: number;
  numberOffsetX: number;
  numberOffsetY: number;
  numberRotation: number;
  numberColor: string;
  messageContents: string;
  messageSize: number;
  messageFont: string;
  messageOffsetX: number;
  messageOffsetY: number;
  messageRotation: number;
  messageColor: string;
  updateMessageDetails: (key: string, value: string | number) => void;
  updateNumberDetails: (key: string, value: string | number) => void;
  setImages: React.Dispatch<React.SetStateAction<CustomImageData[]>>;
  imageRefs: React.MutableRefObject<{ [key: number]: Konva.Image | null }>;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  canvasSize: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedNumber,
  numberFont,
  numberSize,
  strokeWidth,
  numberOffsetX,
  numberOffsetY,
  numberRotation,
  numberColor,
  messageContents,
  messageSize,
  messageFont,
  messageOffsetX,
  messageOffsetY,
  messageRotation,
  messageColor,
  updateMessageDetails,
  updateNumberDetails,
  setImages,
  imageRefs,
  stageRef,
  canvasSize,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string,
    isNumber: boolean = false,
    isText: boolean = false
  ) => {
    const value = e.target.value;
    const updateFn = isText ? updateMessageDetails : updateNumberDetails;

    if (isNumber && !/^\d*$/.test(value)) return;
    updateFn(key, value === "" ? "" : isNumber ? parseInt(value) : value);
  };

  const handleMove = (
    direction: "left" | "right" | "up" | "down",
    isText: boolean = false
  ) => {
    const updateFn = isText ? updateMessageDetails : updateNumberDetails;
    const step = 10;

    const updates: { [key: string]: { key: string; value: number } } = {
      left: isText
        ? { key: "messageOffsetX", value: messageOffsetX - step }
        : { key: "numberOffsetX", value: numberOffsetX + step },
      right: isText
        ? { key: "messageOffsetX", value: messageOffsetX + step }
        : { key: "numberOffsetX", value: numberOffsetX - step },
      up: isText
        ? { key: "messageOffsetY", value: messageOffsetY - step }
        : { key: "numberOffsetY", value: numberOffsetY + step },
      down: isText
        ? { key: "messageOffsetY", value: messageOffsetY + step }
        : { key: "numberOffsetY", value: numberOffsetY - step },
    };

    const { key, value } = updates[direction];
    updateFn(key, value);
  };

  const handleRotate = (
    direction: "left" | "right",
    isText: boolean = false
  ) => {
    const updateFn = isText ? updateMessageDetails : updateNumberDetails;
    const key = isText ? "messageRotation" : "numberRotation";
    const currentValue = isText ? messageRotation : numberRotation;
    const value = direction === "left" ? currentValue + 1 : currentValue - 1;
    updateFn(key, value);
  };

  const resetNumber = () => {
    updateNumberDetails("numberOffsetX", 0);
    updateNumberDetails("numberOffsetY", -30);
    updateNumberDetails("numberRotation", 0);
    updateNumberDetails("selectedNumber", 20);
    updateNumberDetails("numberSize", 550);
    updateNumberDetails("numberFont", "GasoekOne.ttf");
  };

  const resetText = () => {
    updateMessageDetails("messageOffsetX", 0);
    updateMessageDetails("messageOffsetY", 80);
    updateMessageDetails("messageRotation", 0);
    updateMessageDetails("messageSize", 90);
    updateMessageDetails("messageContents", "Happy Birthday");
  };

  const handleFontChangeText = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateMessageDetails("messageFont", value);
  };

  const handleFlip = () => {
    setImages((prevImages) =>
      prevImages.map((img) => {
        if (!img.selected) return img;

        const node = imageRefs.current[img.id];
        if (!node) return img;

        const currentScaleX = img.scaleX ?? 1;
        const newScaleX = -currentScaleX;
        const flippedStatus = !img.flipped;

        const baseWidth = node.getClientRect().width;
        const shift = baseWidth / 2;
        const newX = flippedStatus ? node.x() + shift : node.x() - shift;

        node.scaleX(newScaleX);
        node.x(newX);
        node.getLayer()?.batchDraw();

        return { ...img, scaleX: newScaleX, flipped: flippedStatus, x: newX };
      })
    );
  };

  const handleReset = () => {
    setImages((prevImages) =>
      prevImages.map((img) => {
        if (!img.selected) return img;

        const node = imageRefs.current[img.id];
        if (!node) return img;

        node.rotation(0);

        const originalWidth = 200;
        const originalHeight = img.height;
        const newX = canvasSize / 2 - originalWidth / 2;
        const newY = canvasSize / 2 - originalHeight / 2;

        node.scaleX(1);
        node.scaleY(1);

        return {
          ...img,
          x: newX,
          y: newY,
          width: originalWidth,
          height: originalHeight,
          scaleX: 1,
          flipped: false,
        };
      })
    );
  };

  const exportToPDF = () => {
    if (!stageRef.current) return;

    setImages((prevImages) =>
      prevImages.map((img) => ({ ...img, selected: false }))
    );

    setTimeout(() => {
      const dataURL = stageRef.current!.toDataURL({
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvasSize, canvasSize],
      });

      pdf.addImage(dataURL, "PNG", 0, 0, canvasSize, canvasSize);

      pdf.save("canvas_export.pdf");
    }, 100);
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

      {/* Number Size Input */}
      <label htmlFor="size-input" style={{ marginBottom: "10px" }}>
        Choose font size:
      </label>
      <input
        id="size-input"
        type="text"
        value={numberSize}
        onChange={(e) => handleInputChange(e, "numberSize", true)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Number Font Selector */}
      <label htmlFor="font-selector" style={{ marginTop: "20px" }}>
        Choose a font:
      </label>
      <select
        id="font-selector"
        value={numberFont}
        onChange={(e) => handleInputChange(e, "numberFont")}
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

      {/* Message Input */}
      <label htmlFor="message-input" style={{ marginTop: "20px" }}>
        Enter text phrase:
      </label>
      <input
        id="message-input"
        type="text"
        value={messageContents}
        onChange={(e) => handleInputChange(e, "messageContents", false, true)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      />

      {/* Number movement Controls */}
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
        min="0"
        max="10"
        value={strokeWidth}
        onChange={(e) =>
          updateNumberDetails("strokeWidth", parseInt(e.target.value))
        }
        style={{ width: "100%", marginBottom: "10px" }}
      />
      {/* Number Color */}
      <label htmlFor="number-color" style={{ marginTop: "20px" }}>
        Border Color:
      </label>
      <input
        id="number-color"
        type="color"
        value={numberColor}
        onChange={(e) => handleInputChange(e, "numberColor", false, false)}
        style={{
          width: "100%",
          padding: "5px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      />

      {/* Message Controls */}
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

      {/* Message Font Selector */}
      <select
        id="font-selector-text"
        value={messageFont}
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

      {/* Message Size Input */}
      <label htmlFor="size-input-text" style={{ marginBottom: "10px" }}>
        Choose text font size:
      </label>
      <input
        id="size-input-text"
        type="text"
        value={messageSize}
        onChange={(e) => handleInputChange(e, "messageSize", true, true)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Message Color */}
      <label htmlFor="text-color" style={{ marginTop: "20px" }}>
        Text Color:
      </label>
      <input
        id="text-color"
        type="color"
        value={messageColor}
        onChange={(e) => handleInputChange(e, "messageColor", false, true)}
        style={{
          width: "100%",
          padding: "5px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      />

      {/* Image Controls */}
      <button onClick={handleFlip} style={{ marginTop: "20px" }}>
        Flip Image
      </button>
      <button onClick={handleReset}>Reset Image</button>

      {/*Export to PDF Button */}
      <button onClick={exportToPDF} style={{ marginTop: "20px" }}>
        Export to PDF
      </button>
    </div>
  );
};

export default ControlPanel;
