import React, { useState } from "react";
import Clock from "react-live-clock";

function Dock({
  togglePower,
  setPower,
  showPowerWindow,
  setPowerWindow,
  onOpenWorkWindow,
  tasks = [],
  onTaskClick,
}) {
  const [openStartMenu, setStartMenu] = useState(false);

  const openMenu = () => {
    setStartMenu(!openStartMenu);
  };

  const onPowerClick = () => {
    setPowerWindow(!showPowerWindow);
    openMenu();
  };

  return (
    <div className="dock">
      <div className="dock-inner">
        <button
          className={`start-btn ${openStartMenu ? "active" : ""}`}
          onClick={openMenu}
        >
          Start
        </button>
        <div className="dock-tasks">
          {tasks.map((task) => (
            <button
              key={task.id}
              className="task-button"
              onClick={() => onTaskClick && onTaskClick(task.id)}
              type="button"
            >
              {task.title}
            </button>
          ))}
        </div>
        <div className="dock-time">
          <Clock
            format={"HH:mm"}
            ticking={true}
            timezone={"Asia/Kolkata"}
          />
        </div>
      </div>
      <div className={`start-menu ${openStartMenu ? "open" : ""}`}>
        <div className="title-container">
          <div className="title">
            Windows<span>98</span>
          </div>
        </div>
        <ul>
          <li className="windows-update" onClick={onOpenWorkWindow}>
            My Works
          </li>
          <hr />
          <li
            className="ringcustomizer"
            onClick={() =>
              window.open("https://ring-customizer.vercel.app/", "_blank")
            }
          >
            3D Ring Customizer
          </li>
          <li
            className="redbull"
            onClick={() =>
              window.open("https://redbull3d.vercel.app/", "_blank")
            }
          >
            3D Web Site
          </li>
          <li className="crickboard">CrickBoard</li>
          <li
            className="npm"
            onClick={() =>
              window.open(
                "https://www.npmjs.com/settings/shubham_17/packages",
                "_blank"
              )
            }
          >
            NPM Package
          </li>
          <li
            className="sudoku"
            onClick={() =>
              window.open("https://thirsty-sammet-d9cce0.netlify.app/", "_blank")
            }
          >
            Sudoku App
          </li>
          <li
            className="samvid20"
            onClick={() =>
              window.open(
                "https://shubhamsweb.github.io/MaachateRaho/",
                "_blank"
              )
            }
          >
            Samvid 2020
          </li>
          <li className="samvid">Samvid 2019</li>
          <hr />
          <li className="shut-down ok" onClick={onPowerClick}>
            Shut Down...
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dock;
