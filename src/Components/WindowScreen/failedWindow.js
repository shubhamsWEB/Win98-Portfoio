import React from "react";
import { motion } from "framer-motion";
import MinusImg from "../../assets/images/failed.png";

function FailedWindow({ isHidden, setIsHidden }) {
  const onClose = () => {
    setIsHidden(!isHidden);
  };

  return (
    <motion.div drag dragMomentum={false}>
      <div className="window-container-power">
        <div className="window-success">
          <div className="window-title">
            Email not Sent!
            <button className="btn-close close" onClick={onClose}>
              X
            </button>
          </div>
          <div className="window-body">
            <fieldset style={{ width: "250px" }}>
              <img src={MinusImg} alt="Error" />
              <div>Some error occurred.</div>
            </fieldset>
          </div>
          <div className="window-button-row">
            <button className="btn ok" onClick={onClose}>
              OK
            </button>
            <button className="btn cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default FailedWindow;
