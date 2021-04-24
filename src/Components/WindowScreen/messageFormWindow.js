import React from "react";
import { motion } from "framer-motion";
import emailjs from 'emailjs-com';
function WorkWindow({ isHidden, setIsHidden }) {
  const [maximize, setMaximize] = React.useState(false);
  const nameRef = React.useRef("");
  const emailRef = React.useRef("");
  const messageRef = React.useRef("");
  

  const maximizeWindow = () => {
    setMaximize(!maximize);
  };
  const onClose = () => {
    setIsHidden(!isHidden);
  };
  const sendmessage = () => {
    if (nameRef.current.value != "" && emailRef.current.value != "") {
      const templateParams = {
        from_name: nameRef.current.value,
        reply_to: emailRef.current.value,
        message: messageRef.current.value,
      };
      emailjs
        .send(
          "service_a7jbxgb",
          "template_v8ls1ps",
          templateParams,
          "user_XlHeE5LcVxnspl7Plt9Vv"
        )
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);

          },
          function (err) {
            console.log("ERROR!", err);
          }
        );
    }
  };
  return (
    <motion.div drag dragMomentum={false}>
      <div
        className={`window-custom ${maximize ? "full" : ""} ${
          !isHidden ? "hide" : "show"
        }`}
      >
        <div className="title-bar">
          <div className="title-bar-text">I would love to here from you.</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
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
            style={{ background: "#C0C0C0" }}
          >
            <center>
              <h4 style={{ fontFamily: "AMIBios" }}>
                I like making things and meeting new people.
              </h4>
              <h4 style={{ fontFamily: "AMIBios" }}>
                And I’m eager to receive your feedback. :)
              </h4>
              <div class="field-row-stacked" style={{ width: "200px" }}>
                <label for="text18" style={{ fontFamily: "AMIBios" }}>
                  Your Name
                </label>
                <input id="text18" type="text" ref={nameRef} value={nameRef.current.value} />
              </div>
              <div class="field-row-stacked" style={{ width: "200px" }}>
                <label for="text19" style={{ fontFamily: "AMIBios" }}>
                  Your Email
                </label>
                <input id="text19" type="text" ref={emailRef} value={emailRef.current.value} />
              </div>
              <div class="field-row-stacked" style={{ width: "400px" }}>
                <label for="text20" style={{ fontFamily: "AMIBios" }}>
                  Your Message!
                </label>
                <textarea
                  style={{ fontSize: 15 }}
                  id="text20"
                  rows="8"
                  ref={messageRef}
                  value={messageRef.current.value}
                ></textarea>
              </div>
              <button
                style={{ marginTop: 20, fontFamily: "AMIBios" }}
                onClick={() =>sendmessage()}
              >
                Send message
              </button>
            </center>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WorkWindow;
