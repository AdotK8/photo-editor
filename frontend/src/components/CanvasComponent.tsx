import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Path } from "react-konva";
import * as opentype from "opentype.js";

interface BBox {
  cx: number;
  cy: number;
}

const CanvasComponent: React.FC = () => {
  const canvasSize = 800;
  const fontSize = 550;
  const textContent = "20";
  const [textPath, setTextPath] = useState<string>("");
  const [pathBBox, setPathBBox] = useState<BBox | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [blueRectPos, setBlueRectPos] = useState<{ x: number; y: number }>({
    x: canvasSize / 2 - 50,
    y: canvasSize / 2 - 50,
  });

  // Load the font, generate the SVG path and bounding box.
  useEffect(() => {
    opentype.load("/fonts/arial_black.ttf", (err: any, font: any) => {
      if (err) {
        console.error("Font load error:", err);
        return;
      }
      try {
        const pathObj = font.getPath(textContent, 0, 0, fontSize);
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
  }, [textContent, fontSize]);

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
        {/* Base Layer - Background and interactive hit area */}
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasSize}
            height={canvasSize}
            fill="white"
          />

          {/* Nearly invisible drag handle (full interactive area) */}
          <Rect
            {...blueRectPos}
            width={200}
            height={100}
            fill="rgba(0,0,0,0.001)" // Key fix: minimal alpha for hit detection
            draggable
            onDragMove={handleDragMove}
            listening={true}
          />
        </Layer>

        {/* Visual Layer - Rectangle parts */}
        <Layer>
          {/* Low-opacity outer part */}
          <Rect
            {...blueRectPos}
            width={200}
            height={100}
            fill="blue"
            opacity={0.1}
            listening={false}
          />

          {/* Full-opacity inner part (masked to text) */}
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

        {/* Top Layer - Red outline */}
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
