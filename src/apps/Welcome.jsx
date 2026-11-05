import { profile } from "../content.js";
import { Flag } from "../Boot.jsx";
import { setSettings, useSettings } from "../settings.js";

export default function Welcome({ openApp, close }) {
  const { welcome } = useSettings();
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
          <button onClick={close}>Explore the desktop</button>
        </div>
      </div>
      <p className="welcome-tip">
        <b>Did you know?</b> This works like the real thing. Right-click things, press Start, or type HELP in the MS-DOS Prompt.
      </p>
      <div className="field-row welcome-check">
        <input id="welcome-show" type="checkbox" checked={welcome} onChange={(e) => setSettings({ welcome: e.target.checked })} />
        <label htmlFor="welcome-show">Show this screen each time Shubham 98 starts</label>
      </div>
    </div>
  );
}
