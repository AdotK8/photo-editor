import React from "react";
import { CustomImageData } from "../App";
import "../styles/ImagePanel.scss";

interface ImagePanelProps {
  images: CustomImageData[];
  setImages: React.Dispatch<React.SetStateAction<CustomImageData[]>>;
  canvasSize: number;
}

const ImagePanel: React.FC<ImagePanelProps> = ({
  images,
  setImages,
  canvasSize,
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(img.id);
                }}
                className="delete-button"
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="drop-text">Drag & Drop Images Here</p>
    </div>
  );
};

export default ImagePanel;
