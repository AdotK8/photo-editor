import React, { useState, useRef } from "react";
import Konva from "konva";
import { CustomImageData } from "../App";
import { jsPDF } from "jspdf";
import "../styles/ControlPanel.scss";

// Import icons
import leftIcon from "../images/left.svg";
import rightIcon from "../images/right.svg";
import upIcon from "../images/up.svg";
import downIcon from "../images/down.svg";
import rotateLeftIcon from "../images/rotate-left.svg";
import rotateRightIcon from "../images/rotate-right.svg";
import exportIcon from "../images/export.svg";

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
  const [moveTarget, setMoveTarget] = useState<"number" | "message">("number");
  const numberColorInputRef = useRef<HTMLInputElement>(null);
  const messageColorInputRef = useRef<HTMLInputElement>(null);

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

  const handleMove = (direction: "left" | "right" | "up" | "down") => {
    const updateFn =
      moveTarget === "message" ? updateMessageDetails : updateNumberDetails;
    const step = 10;

    const updates: { [key: string]: { key: string; value: number } } = {
      left:
        moveTarget === "message"
          ? { key: "messageOffsetX", value: messageOffsetX - step }
          : { key: "numberOffsetX", value: numberOffsetX + step },
      right:
        moveTarget === "message"
          ? { key: "messageOffsetX", value: messageOffsetX + step }
          : { key: "numberOffsetX", value: numberOffsetX - step },
      up:
        moveTarget === "message"
          ? { key: "messageOffsetY", value: messageOffsetY - step }
          : { key: "numberOffsetY", value: numberOffsetY + step },
      down:
        moveTarget === "message"
          ? { key: "messageOffsetY", value: messageOffsetY + step }
          : { key: "numberOffsetY", value: numberOffsetY - step },
    };

    const { key, value } = updates[direction];
    updateFn(key, value);
  };

  const handleRotate = (direction: "left" | "right") => {
    const updateFn =
      moveTarget === "message" ? updateMessageDetails : updateNumberDetails;
    const key = moveTarget === "message" ? "messageRotation" : "numberRotation";
    const currentValue =
      moveTarget === "message" ? messageRotation : numberRotation;
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
    updateNumberDetails("numberColor", "#000000");
  };

  const resetText = () => {
    updateMessageDetails("messageOffsetX", 0);
    updateMessageDetails("messageOffsetY", 80);
    updateMessageDetails("messageRotation", 0);
    updateMessageDetails("messageSize", 90);
    updateMessageDetails("messageContents", "Happy Birthday");
    updateMessageDetails("messageColor", "#000000");
  };

  const handleFontChangeText = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateMessageDetails("messageFont", value);
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

  const handleColorButtonClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  return (
    <div className="control-panel">
      <h3>Control Panel</h3>

      {/* Toggle Switch for Number/Message */}
      <div className="move-target-toggle">
        <span className={moveTarget === "number" ? "active" : ""}>Number</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={moveTarget === "message"}
            onChange={() =>
              setMoveTarget(moveTarget === "number" ? "message" : "number")
            }
          />
          <span className="slider"></span>
        </label>
        <span className={moveTarget === "message" ? "active" : ""}>
          Message
        </span>
      </div>

      {/* Movement Controls */}
      <div className="movement-controls">
        <button onClick={() => handleMove("up")} className="icon-button up">
          <img src={upIcon} alt="Move Up" />
        </button>
        <div className="horizontal-controls">
          <button
            onClick={() => handleMove("left")}
            className="icon-button left"
          >
            <img src={leftIcon} alt="Move Left" />
          </button>
          <button
            onClick={() => handleMove("down")}
            className="icon-button down"
          >
            <img src={downIcon} alt="Move Down" />
          </button>
          <button
            onClick={() => handleMove("right")}
            className="icon-button right"
          >
            <img src={rightIcon} alt="Move Right" />
          </button>
        </div>
        <div className="rotate-controls">
          <button
            onClick={() => handleRotate("left")}
            className="icon-button rotate-left"
          >
            <img src={rotateLeftIcon} alt="Rotate Left" />
          </button>
          <button
            onClick={() => handleRotate("right")}
            className="icon-button rotate-right"
          >
            <img src={rotateRightIcon} alt="Rotate Right" />
          </button>
        </div>
      </div>

      {/* Number Settings Section */}
      <div className="settings-section">
        <div className="inline-group">
          <div className="field">
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
          </div>
          <div className="field">
            <label htmlFor="size-input" className="label">
              Font size:
            </label>
            <input
              id="size-input"
              type="text"
              value={numberSize}
              onChange={(e) => handleInputChange(e, "numberSize", true)}
              className="input"
            />
          </div>
        </div>

        <label htmlFor="font-selector" className="label">
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

        <label htmlFor="stroke-width" className="label">
          Thickness:
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
      </div>

      {/* Message Settings Section */}
      <div className="settings-section">
        <label htmlFor="message-input" className="label">
          Enter text phrase:
        </label>
        <input
          id="message-input"
          type="text"
          value={messageContents}
          onChange={(e) => handleInputChange(e, "messageContents", false, true)}
          className="input full-width"
        />

        <div className="inline-group">
          <div className="field">
            <label htmlFor="size-input-text" className="label">
              Font size:
            </label>
            <input
              id="size-input-text"
              type="text"
              value={messageSize}
              onChange={(e) => handleInputChange(e, "messageSize", true, true)}
              className="input"
            />
          </div>
          <div className="field">
            <label htmlFor="font-selector-text" className="label">
              Choose font:
            </label>
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
          </div>
        </div>
      </div>

      {/* Color Selectors Section */}
      <div className="color-selectors">
        <div className="color-selector">
          <label className="label">Border Color:</label>
          <button
            className="color-button"
            style={{ backgroundColor: numberColor }}
            onClick={() => handleColorButtonClick(numberColorInputRef)}
          />
          <input
            ref={numberColorInputRef}
            type="color"
            value={numberColor}
            onChange={(e) => handleInputChange(e, "numberColor", false, false)}
            className="hidden-color-input"
          />
        </div>
        <div className="color-selector">
          <label className="label">Text Color:</label>
          <button
            className="color-button"
            style={{ backgroundColor: messageColor }}
            onClick={() => handleColorButtonClick(messageColorInputRef)}
          />
          <input
            ref={messageColorInputRef}
            type="color"
            value={messageColor}
            onChange={(e) => handleInputChange(e, "messageColor", false, true)}
            className="hidden-color-input"
          />
        </div>
      </div>

      {/* Reset Buttons */}
      <div className="reset-buttons">
        <button onClick={resetNumber} className="button">
          Reset Number
        </button>
        <button onClick={resetText} className="button">
          Reset Text
        </button>
      </div>

      {/* Export to PDF Button */}
      <button onClick={exportToPDF} className="button export-button">
        <img src={exportIcon} alt="Export to PDF" />
        Export to PDF
      </button>
    </div>
  );
};

export default ControlPanel;
