import React from "react";
import Konva from "konva";
import { CustomImageData } from "../App";
import { jsPDF } from "jspdf";
import "../styles/ControlPanel.scss";

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
    <div className="control-panel">
      <h3>Control Panel</h3>

      {/* Number Input */}
      <label htmlFor="number-input" className="label">
        Choose a number:
      </label>
      <input
        id="number-input"
        type="text"
        value={selectedNumber}
        onChange={(e) => handleInputChange(e, "selectedNumber", true)}
        className="input"
      />

      {/* Number Size Input */}
      <label htmlFor="size-input" className="label">
        Choose font size:
      </label>
      <input
        id="size-input"
        type="text"
        value={numberSize}
        onChange={(e) => handleInputChange(e, "numberSize", true)}
        className="input"
      />

      {/* Number Font Selector */}
      <label htmlFor="font-selector" className="label label-top-margin">
        Choose a font:
      </label>
      <select
        id="font-selector"
        value={numberFont}
        onChange={(e) => handleInputChange(e, "numberFont")}
        className="select"
      >
        <option value="GasoekOne.ttf">Gasoek One</option>
        <option value="arial_black.ttf">Arial Black</option>
        <option value="Coiny-Regular.ttf">Coiny</option>
      </select>

      {/* Message Input */}
      <label htmlFor="message-input" className="label label-top-margin">
        Enter text phrase:
      </label>
      <input
        id="message-input"
        type="text"
        value={messageContents}
        onChange={(e) => handleInputChange(e, "messageContents", false, true)}
        className="input input-bottom-margin"
      />

      {/* Number Movement Controls */}
      <button onClick={() => handleMove("left")} className="button">
        Move Left
      </button>
      <button onClick={() => handleMove("right")} className="button">
        Move Right
      </button>
      <button onClick={() => handleMove("up")} className="button">
        Move Up
      </button>
      <button onClick={() => handleMove("down")} className="button">
        Move Down
      </button>
      <button onClick={() => handleRotate("left")} className="button">
        Rotate Left
      </button>
      <button onClick={() => handleRotate("right")} className="button">
        Rotate Right
      </button>
      <button onClick={resetNumber} className="button">
        Reset
      </button>

      {/* Stroke Width */}
      <label htmlFor="stroke-width" className="label label-top-margin">
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
        className="range-input"
      />

      {/* Number Color */}
      <label htmlFor="number-color" className="label label-top-margin">
        Border Color:
      </label>
      <input
        id="number-color"
        type="color"
        value={numberColor}
        onChange={(e) => handleInputChange(e, "numberColor", false, false)}
        className="color-input"
      />

      {/* Message Controls */}
      <button onClick={() => handleMove("left", true)} className="button">
        Move Left (Text)
      </button>
      <button onClick={() => handleMove("right", true)} className="button">
        Move Right (Text)
      </button>
      <button onClick={() => handleMove("up", true)} className="button">
        Move Up (Text)
      </button>
      <button onClick={() => handleMove("down", true)} className="button">
        Move Down (Text)
      </button>
      <button onClick={() => handleRotate("left", true)} className="button">
        Rotate Left (Text)
      </button>
      <button onClick={() => handleRotate("right", true)} className="button">
        Rotate Right (Text)
      </button>
      <button onClick={resetText} className="button">
        Reset Text
      </button>

      {/* Message Font Selector */}
      <select
        id="font-selector-text"
        value={messageFont}
        onChange={handleFontChangeText}
        className="select"
      >
        <option value="Gasoek One">Gasoek One</option>
        <option value="Arial Black">Arial Black</option>
        <option value="Coiny">Coiny</option>
        <option value="Monsieur La Doulaise">Monsieur La Doulaise</option>
        <option value="Imperial Script">Imperial Script</option>
      </select>

      {/* Message Size Input */}
      <label htmlFor="size-input-text" className="label">
        Choose text font size:
      </label>
      <input
        id="size-input-text"
        type="text"
        value={messageSize}
        onChange={(e) => handleInputChange(e, "messageSize", true, true)}
        className="input"
      />

      {/* Message Color */}
      <label htmlFor="text-color" className="label label-top-margin">
        Text Color:
      </label>
      <input
        id="text-color"
        type="color"
        value={messageColor}
        onChange={(e) => handleInputChange(e, "messageColor", false, true)}
        className="color-input"
      />

      {/* Image Controls */}
      <button onClick={handleFlip} className="button button-top-margin">
        Flip Image
      </button>
      <button onClick={handleReset} className="button">
        Reset Image
      </button>

      {/* Export to PDF Button */}
      <button onClick={exportToPDF} className="button button-top-margin">
        Export to PDF
      </button>
    </div>
  );
};

export default ControlPanel;
