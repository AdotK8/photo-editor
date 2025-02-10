import React, { useEffect, useState, useRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Path,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import * as opentype from "opentype.js";
import Konva from "konva";

interface BBox {
  cx: number;
  cy: number;
}

interface CanvasComponentProps {
  selectedNumber: number;
  selectedFont: string;
  selectedSize: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

interface ImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  selectedNumber,
  selectedFont,
  selectedSize,
  offsetX,
  offsetY,
  rotation,
}) => {
  const canvasSize = 800;
  const [textPath, setTextPath] = useState<string>("");
  const [pathBBox, setPathBBox] = useState<BBox | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imagePos, setImagePos] = useState<ImagePosition>({
    x: canvasSize / 2 - 100,
    y: canvasSize / 2 - 50,
    width: 200,
    height: 100,
  });

  const trRef = useRef<Konva.Transformer>(null);
  const imageRef = useRef<Konva.Image>(null);

  // Load font and generate path
  useEffect(() => {
    const fontPath = `/fonts/${selectedFont}`;
    opentype.load(fontPath, (err: any, font: any) => {
      if (err) {
        console.error("Font load error:", err);
        return;
      }
      try {
        const pathObj = font.getPath(
          String(selectedNumber),
          0,
          0,
          selectedSize
        );
        const bbox = pathObj.getBoundingBox();
        const cx = (bbox.x1 + bbox.x2) / 2 + offsetX;
        const cy = (bbox.y1 + bbox.y2) / 2 + offsetY;
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
  }, [selectedNumber, selectedFont, selectedSize, offsetX, offsetY]);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.src = "/images/image1.png";
    img.onload = () => {
      setImage(img);
      setTimeout(() => {
        trRef.current?.nodes([imageRef.current!]);
        trRef.current?.getLayer()?.batchDraw();
      }, 50);
    };
  }, []);

  // Update transformer when image changes
  useEffect(() => {
    if (imageRef.current && trRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [image]);

  const handleTransformEnd = () => {
    if (imageRef.current) {
      const node = imageRef.current;
      setImagePos({
        x: node.x(),
        y: node.y(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
      });
      node.scaleX(1);
      node.scaleY(1);
    }
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
        </Layer>

        <Layer>
          {fontLoaded && textPath && pathBBox && image && (
            <>
              <Path
                data={textPath}
                x={canvasSize / 2 - pathBBox.cx}
                y={canvasSize / 2 - pathBBox.cy}
                fill="white"
                listening={false}
                rotation={rotation}
              />
              <KonvaImage
                image={image}
                ref={imageRef}
                {...imagePos}
                globalCompositeOperation="source-in"
                draggable
                onDragEnd={handleTransformEnd}
                onTransformEnd={handleTransformEnd}
              />
              <Transformer
                ref={trRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 50 || newBox.height < 50) {
                    return oldBox;
                  }
                  return newBox;
                }}
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
              rotation={rotation}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasComponent;
