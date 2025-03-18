import React, { useEffect, useState, useRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Path,
  Image as KonvaImage,
  Transformer,
  Text,
} from "react-konva";
import * as opentype from "opentype.js";
import Konva from "konva";
import { CustomImageData } from "../App";
import "../styles/CanvasComponent.scss";

interface BBox {
  cx: number;
  cy: number;
}

interface CanvasComponentProps {
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
  images: CustomImageData[];
  setImages: React.Dispatch<React.SetStateAction<CustomImageData[]>>;
  imageRefs: React.MutableRefObject<{ [key: number]: Konva.Image | null }>;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  selectedNumber,
  numberFont,
  numberSize,
  strokeWidth,
  numberColor,
  numberOffsetX,
  numberOffsetY,
  numberRotation,
  messageContents,
  messageSize,
  messageFont,
  messageOffsetX,
  messageOffsetY,
  messageRotation,
  messageColor,
  images,
  setImages,
  imageRefs,
  stageRef,
}) => {
  const canvasSize = 800;
  const [textPath, setTextPath] = useState<string>("");
  const [pathBBox, setPathBBox] = useState<BBox | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const outlineLayerRef = useRef<Konva.Layer>(null);
  const textRef = useRef<Konva.Text | null>(null);
  const transformerRefs = useRef<{ [key: number]: Konva.Transformer | null }>(
    {}
  );

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedImage = imagesRef.current.find((img) => img.selected);
      if (!selectedImage) return;

      const step = 1;
      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case "ArrowUp":
          dy = -step;
          break;
        case "ArrowDown":
          dy = step;
          break;
        case "ArrowLeft":
          dx = -step;
          break;
        case "ArrowRight":
          dx = step;
          break;
        default:
          return;
      }

      e.preventDefault();
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === selectedImage.id
            ? { ...img, x: img.x + dx, y: img.y + dy }
            : img
        )
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setImages]);

  useEffect(() => {
    const fontPath = `/fonts/${numberFont}`;
    opentype.load(fontPath, (err: any, font: any) => {
      if (err) {
        console.error("Font load error:", err);
        return;
      }
      try {
        const pathObj = font.getPath(String(selectedNumber), 0, 0, numberSize);
        const bbox = pathObj.getBoundingBox();
        const cx = (bbox.x1 + bbox.x2) / 2 + numberOffsetX;
        const cy = (bbox.y1 + bbox.y2) / 2 + numberOffsetY;
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
  }, [selectedNumber, numberFont, numberSize, numberOffsetX, numberOffsetY]);

  useEffect(() => {
    images.forEach((img: any) => {
      if (imageRefs.current[img.id] && transformerRefs.current[img.id]) {
        transformerRefs.current[img.id]?.nodes([imageRefs.current[img.id]!]);
        transformerRefs.current[img.id]?.getLayer()?.batchDraw();
      }
    });
  }, [images]);

  const handleTransformEnd = (id: number) => {
    const node = imageRefs.current[id];
    if (node) {
      const newX = node.x();
      const newY = node.y();
      const newWidth = node.width();
      const newHeight = node.height();
      const newScaleX = node.scaleX();
      const newScaleY = node.scaleY();

      setImages((prev: any) =>
        prev.map((img: any) =>
          img.id === id
            ? {
                ...img,
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
                scaleX: node.scaleX(),
              }
            : img
        )
      );

      node.scaleX(newScaleX);
      node.scaleY(newScaleY);
    }
  };

  const handleSelect = (id: number) => {
    setImages((prev: any) =>
      prev.map((img: any) => ({ ...img, selected: img.id === id }))
    );
    const node = imageRefs.current[id];
    if (node) {
      const layer = node.getLayer();
      layer?.moveToTop();
      outlineLayerRef.current?.moveToTop();
      transformerRefs.current[id]?.nodes([node]);
    }
  };

  return (
    <div
      tabIndex={0}
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
        ref={stageRef}
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

        {fontLoaded &&
          textPath &&
          pathBBox &&
          images.map((img: CustomImageData) => (
            <Layer key={img.id}>
              <Path
                data={textPath}
                x={canvasSize / 2 - pathBBox.cx}
                y={canvasSize / 2 - pathBBox.cy}
                fill="white"
                listening={false}
                rotation={numberRotation}
              />
              <KonvaImage
                image={img.image}
                ref={(node) => (imageRefs.current[img.id] = node)}
                x={img.x}
                y={img.y}
                width={img.width}
                height={img.height}
                globalCompositeOperation="source-in"
                draggable
                onClick={() => handleSelect(img.id)}
                onTap={() => handleSelect(img.id)}
                onDragEnd={() => handleTransformEnd(img.id)}
                onTransformEnd={() => handleTransformEnd(img.id)}
                scaleX={img.scaleX}
              />
              {img.selected && (
                <Transformer
                  ref={(node) => (transformerRefs.current[img.id] = node)}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 50 || newBox.height < 50) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Layer>
          ))}

        <Layer>
          <Text
            ref={textRef}
            text={messageContents}
            fontSize={messageSize}
            fontFamily={messageFont}
            width={canvasSize}
            align="center"
            fill={messageColor}
            x={messageOffsetX}
            y={messageOffsetY}
            rotation={messageRotation}
          />
        </Layer>

        <Layer ref={outlineLayerRef}>
          {fontLoaded && textPath && pathBBox && (
            <Path
              data={textPath}
              x={canvasSize / 2 - pathBBox.cx}
              y={canvasSize / 2 - pathBBox.cy}
              stroke={numberColor}
              strokeWidth={strokeWidth}
              listening={false}
              rotation={numberRotation}
              globalCompositeOperation="source-over"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasComponent;
