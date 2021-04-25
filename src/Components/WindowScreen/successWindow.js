import React from "react";
import { motion } from "framer-motion";
import TickImg from '../../assets/images/tick.png';
function Powerwindow({ isHidden, setIsHidden,togglePower, setPower }) {
  const [maximize, setMaximize] = React.useState(false);
  const maximizeWindow = () => {
    setMaximize(!maximize);
  };
  const onClose = () => {
    setIsHidden(!isHidden);
  };
  return (
    <motion.div drag dragMomentum={false}>
      <div class="window-container-power">
        <div class="window-success">
          <div class="window-title">
            Email Sent Successfully!
            <div class="btn-close close" onClick={onClose}>X</div>
          </div>
          <div class="window-body">
            <fieldset
              style={{ width: "250px" }}
            >
                <img src={TickImg} alt="Success" />
              <div>Thanks for getting in touch.</div>
              
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
