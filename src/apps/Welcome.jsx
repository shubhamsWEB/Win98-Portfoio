import { profile } from "../content.js";
import { Flag } from "../Boot.jsx";

export default function Welcome({ openApp, close }) {
  const go = (id, props) => {
    openApp(id, props);
    close();
  };
  return (
    <div className="welcome">
      <header>
        <Flag size={30} />
        <h2>
          Welcome to <b>Shubham</b>98
        </h2>
      </header>
      <div className="welcome-main">
        <div className="prose">
          <h3>Hi, I'm {profile.name}.</h3>
          <p>{profile.tagline}</p>
          <p>
            6+ years shipping production software. Currently a {profile.title.toLowerCase()} at Ford,
            and the creator of Murmur and NexusCode.
          </p>
        </div>
        <div className="welcome-actions">
          <button className="default" onClick={() => go("projects")}>See my projects</button>
          <button onClick={() => go("about", { tab: "Experience" })}>View experience</button>
          <button onClick={() => go("contact")}>Get in touch</button>
        </div>
      </div>
      <p className="welcome-tip">
        <b>Tip:</b> this works like the real thing. Open icons, move windows, press Start.
      </p>
    </div>
  );
}
