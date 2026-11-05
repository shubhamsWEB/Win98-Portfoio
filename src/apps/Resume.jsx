import { links, profile } from "../content.js";
import { icons } from "../icons.js";
import { MenuBar } from "../ui/Menu.jsx";

const FILE_NAME = "Shubham_Agrawal_Resume.pdf";
const openTab = () => window.open(links.resume, "_blank", "noopener");

export default function Resume({ openApp, close }) {
  // ponytail: phones mostly can't show a PDF in a frame, so they get a card. Upgrade path is pdf.js, not worth 500KB today.
  const embeddable = !matchMedia("(pointer: coarse)").matches;
  const download = () => Object.assign(document.createElement("a"), { href: links.resume, download: FILE_NAME }).click();

  return (
    <div className="resume">
      <MenuBar
        menus={[
          { label: "File", items: [{ label: "Download", onClick: download }, { label: "Open in New Tab", onClick: openTab }, { separator: true }, { label: "Close", onClick: close }] },
          { label: "Help", items: [{ label: "Help Topics", onClick: () => openApp("help") }] },
        ]}
      />
      <div className="resume-toolbar">
        <a className="btn-link" href={links.resume} download={FILE_NAME}>Download PDF</a>
        <a className="btn-link" href={links.resume} target="_blank" rel="noreferrer">Open in new tab</a>
      </div>
      {embeddable ? (
        <div className="resume-view">
          <iframe src={`${links.resume}#view=FitH`} title={`${profile.name} resume`} />
        </div>
      ) : (
        <div className="resume-card prose">
          <img src={icons.pdf} alt="" width="48" height="48" />
          <h3>{profile.name}'s resume</h3>
          <p>Open or download it using the buttons above.</p>
        </div>
      )}
    </div>
  );
}
