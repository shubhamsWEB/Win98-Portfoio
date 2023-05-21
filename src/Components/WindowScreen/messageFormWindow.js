import React from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import BeepSound from "../../assets/sounds/beep.mp3";
function WorkWindow({ isHidden, setIsHidden, setError, setSuccess }) {
  const [maximize, setMaximize] = React.useState(false);
  const nameRef = React.useRef("");
  const emailRef = React.useRef("");
  const messageRef = React.useRef("");
  const [isSent, setSentStatus] = React.useState(false);

  const maximizeWindow = () => {
    setMaximize(!maximize);
  };
  const onClose = () => {
    setIsHidden(!isHidden);
  };
  const sendmessage = () => {
    if (nameRef.current.value !== "" && emailRef.current.value !== "") {
      setSentStatus(!isSent);
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
            nameRef.current.value = "";
            emailRef.current.value = "";
            messageRef.current.value = "";
            setSentStatus(false);
            setSuccess(true);
            new Audio(BeepSound).play();
            onClose();
          },
          function (err) {
            setSentStatus(false);
            setError(true);
            new Audio(BeepSound).play();
            onClose();
            console.log("ERROR!", err);
          }
        );
    } else {
      alert("Please Enter all fields");
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
                Always happy to hear from you. :)
              </h4>
              <div className="field-row-stacked" style={{ width: "200px" }}>
                <label for="text18" style={{ fontFamily: "AMIBios" }}>
                  Your Name
                </label>
                <input id="text18" type="text" ref={nameRef} />
              </div>
              <div className="field-row-stacked" style={{ width: "200px" }}>
                <label for="text19" style={{ fontFamily: "AMIBios" }}>
                  Your Email
                </label>
                <input id="text19" type="text" ref={emailRef} />
              </div>
              <div className="field-row-stacked" style={{ width: "400px" }}>
                <label for="text20" style={{ fontFamily: "AMIBios" }}>
                  Your Message!
                </label>
                <textarea
                  style={{ fontSize: 15 }}
                  id="text20"
                  rows="8"
                  ref={messageRef}
                ></textarea>
              </div>
              <button
                style={{ marginTop: 20, fontFamily: "AMIBios" }}
                onClick={() => {
                  !isSent ? sendmessage() : alert("Message Sent");
                }}
                type="button"
                disabled={!isSent ? false : true}
              >
                Send message!
              </button>
            </center>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WorkWindow;
