import React from "react";
import { motion } from "framer-motion";

function WindowScreen({
  children,
  isHidden,
  setIsHidden,
  constraintsRef,
  title,
  onClose: onCloseProp,
}) {
  const [maximize, setMaximize] = React.useState(false);

  const maximizeWindow = () => {
    setMaximize((prev) => !prev);
  };

  const onClose = () => {
    if (onCloseProp) {
      onCloseProp();
    } else {
      setIsHidden(!isHidden);
    }
  };

  const onMinimize = () => {
    setIsHidden(false);
  };

  return (
    <motion.div drag dragMomentum={false} dragConstraints={constraintsRef}>
      <div
        className={`window-custom ${maximize ? "full" : ""} ${
          !isHidden ? "hide" : "show"
        }`}
      >
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={onMinimize}></button>
            <button
              aria-label={maximize ? "Restore" : "Maximize"}
              onClick={maximizeWindow}
            ></button>
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className={`window-body-custom ${maximize ? "full" : ""}`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export default WindowScreen;
