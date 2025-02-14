import React from "react";
import { CustomImageData } from "../App";

interface ImagePanelProps {
  images: CustomImageData[];
  setImages: React.Dispatch<React.SetStateAction<CustomImageData[]>>;
}

const ImagePanel: React.FC<ImagePanelProps> = ({ images, setImages }) => {
  return (
    <div
      style={{
        width: "250px",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        borderRight: "2px solid #ddd",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h3>Images</h3>
    </div>
  );
};

export default ImagePanel;
