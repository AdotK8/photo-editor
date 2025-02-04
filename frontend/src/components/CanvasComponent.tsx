import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Group } from "react-konva";
import * as opentype from "opentype.js";

interface BBox {
  cx: number;
  cy: number;
}

const CanvasComponent: React.FC = () => {
  const canvasSize = 800;
  const fontSize = 550;
  const textContent = "60";

  const [textPath, setTextPath] = useState<string>("");
  const [pathBBox, setPathBBox] = useState<BBox | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

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
          {fontLoaded && textPath && pathBBox && (
            <Group
              clipFunc={(ctx) => {
                try {
                  const clipPath = new Path2D(textPath);
                  ctx.save();
                  // Translate to canvas center, then offset by the path's center.
                  ctx.translate(
                    canvasSize / 2 - pathBBox.cx,
                    canvasSize / 2 - pathBBox.cy
                  );
                  ctx.beginPath();
                  ctx.fill(clipPath);
                  ctx.clip();
                  ctx.restore();
                } catch (error) {
                  console.error("Error in clipFunc:", error);
                }
              }}
            >
              {/* The rectangle below is visible only inside the clip region */}
              <Rect
                x={0}
                y={0}
                width={canvasSize}
                height={canvasSize}
                fill="blue"
              />
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasComponent;
