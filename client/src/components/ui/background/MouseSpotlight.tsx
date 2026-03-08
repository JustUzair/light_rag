import React from "react";

const MouseSpotlight = ({ mouse }: { mouse: { x: number; y: number } }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(520px circle at ${mouse.x}px ${mouse.y}px, rgba(109,40,217,0.055), transparent 70%)`,
      }}
    />
  );
};

export default MouseSpotlight;
