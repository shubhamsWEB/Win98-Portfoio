import { useEffect, useState } from "react";
import { education, experience, links, profile, skills } from "../content.js";
import computer from "../assets/icons/computer.png";

const TABS = ["General", "Experience", "Skills"];

export default function About({ tab = "General", request, openApp }) {
  const [active, setActive] = useState(tab);
  // Re-applies on every open request, even for the same tab.
  useEffect(() => setActive(tab), [tab, request]);

  return (
    <div className="about">
      <menu role="tablist" aria-label="About sections">
        {TABS.map((t) => (
          <li role="tab" key={t} aria-selected={active === t}>
            <a
              href={`#${t}`}
              onClick={(e) => {
                e.preventDefault();
                setActive(t);
              }}
            >
              {t}
            </a>
          </li>
        ))}
      </menu>
      <div className="window tab-panel" role="tabpanel" aria-label={active}>
        <div className="window-body prose scroll">
          {active === "General" && <General openApp={openApp} />}
          {active === "Experience" && <Experience />}
          {active === "Skills" && <Skills />}
        </div>
      </div>
    </div>
  );
}

function General({ openApp }) {
  return (
    <div className="general">
      <img src={computer} alt="" width="64" height="64" className="pixel" />
      <div>
        <h3>{profile.name}</h3>
        <p>{profile.summary}</p>
        <dl>
          {profile.facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="row">
          <button onClick={() => openApp("projects")}>My projects</button>
          <button onClick={() => openApp("contact")}>Send a message</button>
          <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
      </div>
    </div>
  );
}

function Experience() {
  return experience.map((job) => (
    <article className="job" key={job.company}>
      <header>
        <h3>{job.company}</h3>
        <span>{job.period}</span>
      </header>
      <em>{job.role}</em>
      <ul>
        {job.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </article>
  ));
}

function Skills() {
  return (
    <>
      <fieldset>
        <legend>Skills</legend>
        <dl className="skills">
          {skills.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </fieldset>
      <fieldset>
        <legend>Education</legend>
        {education.map(([degree, school, year]) => (
          <p key={degree}>
            <b>{degree}</b>, {year}
            <br />
            {school}
          </p>
        ))}
      </fieldset>
    </>
  );
}
