import React from "react";
import { motion } from "framer-motion";
import TickImg from '../../assets/images/tick.png';
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
      <div className="window-container-power">
        <div className="window-success">
          <div className="window-title">
            Email Sent Successfully!
            <div className="btn-close close" onClick={onClose}>X</div>
          </div>
          <div className="window-body">
            <fieldset
              style={{ width: "250px" }}
            >
                <img src={TickImg} alt="Success" />
              <div>Thanks for getting in touch.</div>
              
            </fieldset>
          </div>
          <div className="window-button-row">
          <button className="btn ok" onClick={() => onClose()}>OK</button>
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Powerwindow;
