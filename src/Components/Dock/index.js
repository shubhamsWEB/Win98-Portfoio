import React,{ useState} from "react";
import Clock from 'react-live-clock';
function Dock({togglePower, setPower,showPowerWindow, setPowerWindow}) {
const [openStartMenu, setStartMenu] = useState(false);
const openMenu = () => {
    setStartMenu(!openStartMenu);
}
const onPowerClick = () => {
  setPowerWindow(!showPowerWindow);
  openMenu();
}

  return (
    <div className="dock">
      <button className={`start-btn ${openStartMenu ? 'active' :""}`} onClick={openMenu}>
        Start
      </button>
      <div className="dock-time"><Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Kolkata'} /></div>
      <div className={`start-menu ${openStartMenu ? 'open' :""}`}>
        <div className="title-container">
          <div className="title">
            Windows<span>98</span>
          </div>
        </div>
        <ul>
          <li className="windows-update">My Works</li>
          <hr />
          <li className="ringcustomizer">3D Ring Customizer</li>
          <li className="redbull">3D Web Site</li>
          <li className="crickboard">CrickBoard</li>
          <li className="npm">NPM Package</li>
          <li className="sudoku">Sudoku App</li>
          <li className="samvid20">Samvid 2020</li>
          <li className="samvid">Samvid 2019</li>
          <hr />
          <li className="shut-down ok" onClick={onPowerClick}>Shut Down...</li>
        </ul>
      </div>
    </div>
  );
}

export default Dock;
