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
      <div class="window-container-power">
        <div class="window-power">
          <div class="window-title">
            Shut Down Windows
            <div class="btn-close close" onClick={onClose}>X</div>
          </div>
          <div class="window-body">
            <fieldset
              style={{ width: "200px", float: "right", marginRight: "50px" }}
            >
              <div class="field-row">What do you want the computer to do?</div>
              <div class="field-row">
                <input id="radio10" type="radio" name="fieldset-example" />
                <label for="radio10">Stand By</label>
              </div>
              <div class="field-row">
                <input id="radio11" type="radio" name="fieldset-example" checked />
                <label for="radio11">Shut Down</label>
              </div>
              <div class="field-row">
                <input id="radio12" type="radio" name="fieldset-example" />
                <label for="radio12">Restart</label>
              </div>
            </fieldset>
          </div>
          <div class="window-button-row">
          <button class="btn ok" onClick={() => {setPower(!togglePower);onClose()}}>OK</button>
          <button class="btn cancel" onClick={onClose}>Cancel</button>
          <button class="btn">Help</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Powerwindow;
