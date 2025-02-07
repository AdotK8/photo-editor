import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Path } from "react-konva";
import * as opentype from "opentype.js";

interface BBox {
  cx: number;
  cy: number;
}

interface CanvasComponentProps {
  selectedNumber: string;
  selectedFont: string;
  selectedSize: string;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  selectedNumber,
  selectedFont,
  selectedSize,
}) => {
  const canvasSize = 800;
  const [textPath, setTextPath] = useState<string>("");
  const [pathBBox, setPathBBox] = useState<BBox | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [blueRectPos, setBlueRectPos] = useState<{ x: number; y: number }>({
    x: canvasSize / 2 - 50,
    y: canvasSize / 2 - 50,
  });

  // Load the font, generate the SVG path and bounding box based on the selected font
  useEffect(() => {
    const fontPath = `/fonts/${selectedFont}`;
    opentype.load(fontPath, (err: any, font: any) => {
      if (err) {
        console.error("Font load error:", err);
        return;
      }
      try {
        const pathObj = font.getPath(selectedNumber, 0, 0, selectedSize);
        const bbox = pathObj.getBoundingBox();
        const cx = (bbox.x1 + bbox.x2) / 2;
        const cy = (bbox.y1 + bbox.y2) / 2;
        setPathBBox({ cx, cy });
        const svgString = pathObj.toSVG();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const pathElement = svgDoc.querySelector("path");
        if (pathElement) {
          setTextPath(pathElement.getAttribute("d") || "");
          setFontLoaded(true);
        }
      } catch (error) {
        console.error("Path generation error:", error);
      }
    });
  }, [selectedNumber, selectedFont, selectedSize]); // Re-run whenever the selected number or font changes

  // Handle dragging of the blue rectangle
  const handleDragMove = (e: any) => {
    setBlueRectPos({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <div
      style={{
        width: `${canvasSize}px`,
        height: `${canvasSize}px`,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stage
        width={canvasSize}
        height={canvasSize}
        style={{ backgroundColor: "white", border: "4px solid black" }}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasSize}
            height={canvasSize}
            fill="white"
          />

          {/* Invisible drag handle */}
          <Rect
            {...blueRectPos}
            width={200}
            height={100}
            fill="rgba(0,0,0,0.001)"
            draggable
            onDragMove={handleDragMove}
            listening={true}
          />
        </Layer>

        <Layer>
          <Rect
            {...blueRectPos}
            width={200}
            height={100}
            fill="blue"
            opacity={0.1}
            listening={false}
          />
          {fontLoaded && textPath && pathBBox && (
            <>
              <Path
                data={textPath}
                x={canvasSize / 2 - pathBBox.cx}
                y={canvasSize / 2 - pathBBox.cy}
                fill="white"
                listening={false}
              />
              <Rect
                {...blueRectPos}
                width={200}
                height={100}
                fill="blue"
                globalCompositeOperation="source-in"
                opacity={1}
                listening={false}
              />
            </>
          )}
        </Layer>

        <Layer>
          {fontLoaded && textPath && pathBBox && (
            <Path
              data={textPath}
              x={canvasSize / 2 - pathBBox.cx}
              y={canvasSize / 2 - pathBBox.cy}
              stroke="black"
              strokeWidth={2}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasComponent;
