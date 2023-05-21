import React from "react";
import { motion } from "framer-motion";
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
        <div className="window-power">
          <div className="window-title">
            Shut Down Windows
            <div className="btn-close close" onClick={onClose}>X</div>
          </div>
          <div className="window-body">
            <fieldset
              style={{ width: "200px", float: "right", marginRight: "50px" }}
            >
              <div className="field-row">What do you want the computer to do?</div>
              <div className="field-row">
                <input id="radio10" type="radio" name="fieldset-example" />
                <label for="radio10">Stand By</label>
              </div>
              <div className="field-row">
                <input id="radio11" type="radio" name="fieldset-example" checked />
                <label for="radio11">Shut Down</label>
              </div>
              <div className="field-row">
                <input id="radio12" type="radio" name="fieldset-example" />
                <label for="radio12">Restart</label>
              </div>
            </fieldset>
          </div>
          <div className="window-button-row">
          <button className="btn ok" onClick={() => {setPower(!togglePower);onClose()}}>OK</button>
          <button className="btn cancel" onClick={onClose}>Cancel</button>
          <button className="btn">Help</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Powerwindow;
