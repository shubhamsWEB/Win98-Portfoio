import React from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import BeepSound from "../../assets/sounds/beep.mp3";

function MessageFormWindow({
  isHidden,
  setIsHidden,
  setError,
  setSuccess,
  onClose: onCloseProp,
}) {
  const [maximize, setMaximize] = React.useState(false);
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const messageRef = React.useRef(null);
  const [isSent, setSentStatus] = React.useState(false);

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

  const sendmessage = () => {
    if (
      nameRef.current &&
      emailRef.current &&
      nameRef.current.value.trim() !== "" &&
      emailRef.current.value.trim() !== ""
    ) {
      setSentStatus(true);
      const templateParams = {
        from_name: nameRef.current.value,
        reply_to: emailRef.current.value,
        message: messageRef.current ? messageRef.current.value : "",
      };

      emailjs
        .send(
          "service_a7jbxgb",
          "template_v8ls1ps",
          templateParams,
          "user_XlHeE5LcVxnspl7Plt9Vv"
        )
        .then(
          function () {
            if (nameRef.current) nameRef.current.value = "";
            if (emailRef.current) emailRef.current.value = "";
            if (messageRef.current) messageRef.current.value = "";
            setSentStatus(false);
            setSuccess(true);
            new Audio(BeepSound).play();
            onClose();
          },
          function (err) {
            console.log("ERROR!", err);
            setSentStatus(false);
            setError(true);
            new Audio(BeepSound).play();
            onClose();
          }
        );
    } else {
      alert("Please enter all fields");
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
          <div className="title-bar-text">I would love to hear from you.</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button
              aria-label={maximize ? "Restore" : "Maximize"}
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
                <label htmlFor="text18" style={{ fontFamily: "AMIBios" }}>
                  Your Name
                </label>
                <input id="text18" type="text" ref={nameRef} />
              </div>
              <div className="field-row-stacked" style={{ width: "200px" }}>
                <label htmlFor="text19" style={{ fontFamily: "AMIBios" }}>
                  Your Email
                </label>
                <input id="text19" type="email" ref={emailRef} />
              </div>
              <div className="field-row-stacked" style={{ width: "400px" }}>
                <label htmlFor="text20" style={{ fontFamily: "AMIBios" }}>
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
                  if (!isSent) {
                    sendmessage();
                  } else {
                    alert("Message already being sent");
                  }
                }}
                type="button"
                disabled={isSent}
              >
                {isSent ? "Sending..." : "Send message!"}
              </button>
            </center>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MessageFormWindow;
