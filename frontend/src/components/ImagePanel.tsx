import React from "react";
import { CustomImageData } from "../App";

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
          // Calculate height maintaining aspect ratio
          const aspectRatio = img.naturalHeight / img.naturalWidth;
          const fixedWidth = 200;
          const calculatedHeight = fixedWidth * aspectRatio;

          setImages((prevImages) => [
            ...prevImages,
            {
              id: prevImages.length + 1,
              image: img,
              x: canvasSize / 2 - fixedWidth / 2, // Center the image
              y: canvasSize / 2 - calculatedHeight / 2, // Center the image
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
      style={{
        width: "250px",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        borderRight: "2px solid #ddd",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        textAlign: "center",
        alignItems: "center",
        border: "2px dashed #bbb",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Images</h3>
      <div
        style={{
          width: "100%",
          maxHeight: "150px",
          overflowY: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          justifyContent: "center",
          padding: "10px",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        {images.map((img) => (
          <div key={img.id} style={{ position: "relative" }}>
            <img
              src={img.image.src}
              alt={`Uploaded ${img.id}`}
              onClick={() => handleSelectImage(img.id)}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "5px",
                border: img.selected ? "3px solid blue" : "1px solid #ccc",
                cursor: "pointer",
                transform: img.flipped ? "scaleX(-1)" : "scaleX(1)",
              }}
            />
            {img.selected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage(img.id);
                }}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(255, 255, 255, 0.7)",
                  border: "none",
                  borderRadius: "50%",
                  padding: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "red",
                }}
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
      <p style={{ marginTop: "10px", flexGrow: 1 }}>Drag & Drop Images Here</p>
    </div>
  );
};

export default ImagePanel;
