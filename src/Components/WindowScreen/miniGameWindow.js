import React from "react";
import { motion } from "framer-motion";
import MiniGame from "../MiniGame/SlotMachine";
import MinecraftImg from "../../assets/images/minecraft.jpeg";

function WorkWindow({ isHidden, setIsHidden, onClose: onCloseProp }) {
  const [maximize, setMaximize] = React.useState(false);

  const maximizeWindow = () => {
    setMaximize(!maximize);
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
    <motion.div drag dragMomentum={false}>
      <div
        className={`window-custom ${maximize ? "full" : ""} ${
          !isHidden ? "hide" : "show"
        }`}
      >
        <div className="title-bar">
          <div className="title-bar-text">Mini Merio Slotes</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={onMinimize}></button>
            <button
              aria-label={`${maximize ? "Restore" : "Maximize"}`}
              onClick={maximizeWindow}
            ></button>
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className={`window-body-custom ${maximize ? "full" : ""}`}>
          <div
            className="work-window-container"
            style={{
              backgroundImage: `url(${MinecraftImg})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <MiniGame />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WorkWindow;
