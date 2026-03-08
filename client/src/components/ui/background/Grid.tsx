import React from "react";

const Grid = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `linear-gradient(rgba(109,40,217,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(109,40,217,0.028) 1px,transparent 1px)`,
        backgroundSize: "44px 44px",
      }}
    />
  );
};

export default Grid;
