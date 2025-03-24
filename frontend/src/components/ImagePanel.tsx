import React from "react";
import { CustomImageData } from "../App";
import Konva from "konva";
import "../styles/ImagePanel.scss";

interface ImagePanelProps {
  images: CustomImageData[];
  setImages: React.Dispatch<React.SetStateAction<CustomImageData[]>>;
  canvasSize: number;
  imageRefs: React.MutableRefObject<{ [key: number]: Konva.Image | null }>;
}

const ImagePanel: React.FC<ImagePanelProps> = ({
  images,
  setImages,
  canvasSize,
  imageRefs,
}) => {
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const aspectRatio = img.naturalHeight / img.naturalWidth;
          const fixedWidth = 200;
          const calculatedHeight = fixedWidth * aspectRatio;

          setImages((prevImages) => [
            ...prevImages,
            {
              id: prevImages.length + 1,
              image: img,
              x: canvasSize / 2 - fixedWidth / 2,
              y: canvasSize / 2 - calculatedHeight / 2,
              width: fixedWidth,
              height: calculatedHeight,
              selected: false,
              flipped: false,
              scaleX: 1,
            },
          ]);
        };
      };
    }
  };

  const handleSelectImage = (id: number) => {
    setImages((prev: any) =>
      prev.map((img: any) => ({ ...img, selected: img.id === id }))
    );
  };

  const handleDeleteImage = (id: number) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
  };

  const handleFlipImage = (id: number) => {
    setImages((prevImages) =>
      prevImages.map((img) => {
        if (img.id !== id) return img;

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

  const handleResetImage = (id: number) => {
    setImages((prevImages) =>
      prevImages.map((img) => {
        if (img.id !== id) return img;

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

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className="image-panel"
    >
      <h3 className="image-panel-title">Images</h3>
      <div className="image-container">
        {images.map((img) => (
          <div key={img.id} className="image-wrapper">
            <img
              src={img.image.src}
              alt={`Uploaded ${img.id}`}
              onClick={() => handleSelectImage(img.id)}
              className={`thumbnail ${img.selected ? "selected" : ""} ${
                img.flipped ? "flipped" : ""
              }`}
            />
            {img.selected && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(img.id);
                  }}
                  className="delete-button"
                >
                  X
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipImage(img.id);
                  }}
                  className="flip-button"
                >
                  ⇆
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetImage(img.id);
                  }}
                  className="reset-button"
                >
                  ↺
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <p className="drop-text">Drag & Drop Images Here</p>
    </div>
  );
};

export default ImagePanel;
