import React from "react";

function Icons({imgSrc,title,onClick,...rest}) {
  return (
    <div className={`icon ${rest.className}`} onDoubleClick={() => onClick()}>
      <img
        src={imgSrc}
        alt=""
        draggable={false}
        className={`${rest.small}`}
      />
      <p style={{fontFamily:'AMIBios'}}>{title}</p>
    </div>
  );
}

export default Icons;
