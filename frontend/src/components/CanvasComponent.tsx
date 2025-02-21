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
import { CustomImageData } from "../App";

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
  images: CustomImageData[];
  setImages: React.Dispatch<React.SetStateAction<CustomImageData[]>>;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  selectedNumber,
  selectedFont,
  selectedSize,
  offsetX,
  offsetY,
  rotation,
  images,
  setImages,
}) => {
  const canvasSize = 800;
  const [textPath, setTextPath] = useState<string>("");
  const [pathBBox, setPathBBox] = useState<BBox | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const outlineLayerRef = useRef<Konva.Layer>(null);

  // initialising refs for each image, and tranformers for each image, keyed by image id.
  const imageRefs = useRef<{ [key: number]: Konva.Image | null }>({});
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

      e.preventDefault(); // Prevent default scrolling
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

  // Load font and generate the mask path.
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

  // Attach transformers to images
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
      const newWidth = node.width() * node.scaleX();
      const newHeight = node.height() * node.scaleY();
      setImages((prev: any) =>
        prev.map((img: any) =>
          img.id === id
            ? { ...img, x: newX, y: newY, width: newWidth, height: newHeight }
            : img
        )
      );
      // Reset the scaling factors.
      node.scaleX(1);
      node.scaleY(1);
    }
  };

  // When an image is clicked, mark it as selected and unselect others.
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
        {/* Background Layer */}
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasSize}
            height={canvasSize}
            fill="white"
          />
        </Layer>

        {/* Render each image on its own layer */}
        {fontLoaded &&
          textPath &&
          pathBBox &&
          images.map((img: any) => (
            <Layer key={img.id}>
              {/* Mask Path */}
              <Path
                data={textPath}
                x={canvasSize / 2 - pathBBox.cx}
                y={canvasSize / 2 - pathBBox.cy}
                fill="white"
                listening={false}
                rotation={rotation}
              />
              {/* Image */}
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
              />
              {/* Conditionally render the transformer only if this image is selected */}
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

        {/* Outline (stroke) Path */}
        <Layer ref={outlineLayerRef}>
          {fontLoaded && textPath && pathBBox && (
            <Path
              data={textPath}
              x={canvasSize / 2 - pathBBox.cx}
              y={canvasSize / 2 - pathBBox.cy}
              stroke="black"
              strokeWidth={2}
              listening={false}
              rotation={rotation}
              globalCompositeOperation="source-over"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasComponent;
