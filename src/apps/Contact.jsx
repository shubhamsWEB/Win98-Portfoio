import { useState } from "react";
import emailjs from "emailjs-com";
import { links } from "../content.js";
import tick from "../assets/icons/tick.png";
import failed from "../assets/icons/failed.png";

export default function Contact({ close }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("website")) return setStatus("sent"); // honeypot: quietly drop bots
    setStatus("sending");
    try {
      await emailjs.send(
        "service_a7jbxgb",
        "template_v8ls1ps",
        {
          from_name: form.get("name"),
          reply_to: form.get("email"),
          message: form.get("message"),
        },
        "user_XlHeE5LcVxnspl7Plt9Vv"
      );
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="result prose" role="status">
        <img src={tick} alt="" width="32" height="32" />
        <h3>Message sent</h3>
        <p>Thanks for getting in touch. I'll reply by email.</p>
        <button className="default" autoFocus onClick={close}>OK</button>
      </div>
    );
  }

  return (
    <form className="contact prose" onSubmit={submit}>
      <p>Hiring, collaborating or just curious? I read everything.</p>
      <label htmlFor="c-name">Your name</label>
      <input id="c-name" name="name" type="text" required maxLength={100} autoComplete="name" />
      <label htmlFor="c-email">Your email</label>
      <input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" />
      <label htmlFor="c-message">Message</label>
      <textarea id="c-message" name="message" required rows={6} maxLength={4000} />
      <input className="hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {status === "error" && (
        <p className="form-error" role="alert">
          <img src={failed} alt="" width="16" height="16" />
          <span>
            Couldn't send that. Your text is still here: try again, or reach me on{" "}
            <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>.
          </span>
        </p>
      )}
      <div className="row-end">
        <button type="submit" className="default" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
