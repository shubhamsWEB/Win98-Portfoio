import React from "react";

function Icons({imgSrc,title,onClick,...rest}) {
  return (
    <div className={`icon ${rest.className}`}  onDoubleClick={() => onClick()}>
      <img
        src={imgSrc}
        alt=""
        draggable={false}
        className={`${rest.small}`}
        width='48px'
        height='48px'
      />
      <p>{title}</p>
    </div>
  );
}

export default Icons;
