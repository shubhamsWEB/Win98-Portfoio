import React from "react";

function Icons({ imgSrc, title, onClick, ...rest }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`icon ${rest.className || ""}`}
      onDoubleClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <img
        src={imgSrc}
        alt={title || "desktop icon"}
        draggable={false}
        className={`${rest.small || ""}`}
        width="48"
        height="48"
      />
      <p>{title}</p>
    </div>
  );
}

export default Icons;
