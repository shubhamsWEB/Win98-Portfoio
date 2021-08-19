import React from "react";
import { motion } from "framer-motion";
import MinusImg from '../../assets/images/failed.png';
function Powerwindow({ isHidden, setIsHidden,togglePower, setPower }) {
  // const [maximize, setMaximize] = React.useState(false);
  // const maximizeWindow = () => {
  //   setMaximize(!maximize);
  // };
  const onClose = () => {
    setIsHidden(!isHidden);
  };
  return (
    <motion.div drag dragMomentum={false}>
      <div class="window-container-power">
        <div class="window-success">
          <div class="window-title">
            Email not Sent !
            <div class="btn-close close" onClick={onClose}>X</div>
          </div>
          <div class="window-body">
            <fieldset
              style={{ width: "250px" }}
            >
                <img src={MinusImg} alt="Success" />
              <div>Some Error occured.</div>
              
            </fieldset>
          </div>
          <div class="window-button-row">
          <button class="btn ok" onClick={() => onClose()}>OK</button>
          <button class="btn cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Powerwindow;
