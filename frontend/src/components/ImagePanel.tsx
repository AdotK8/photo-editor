import React from "react";

interface ImagePanelProps {}

const ImagePanel: React.FC<ImagePanelProps> = ({}) => {
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
