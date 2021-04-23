import React from "react";
import Dock from "../Dock";
import DesktopIcon from "../DesktopIcons";
import WindowScreen from "../WindowScreen";
import PowerWindowScreen from "../WindowScreen/powerwindow";
import WorkWindowScreen from "../WindowScreen/workwindow";
import Overlay from "../Overlay";
import AboutImg from "../../assets/images/users.png";
import HomeImg from "../../assets/images/computer.png";
import ProjectImg from "../../assets/images/folder.png";
import GithubImg from "../../assets/images/github.png";
import LinkedInImg from "../../assets/images/linkedin.png";
import ExplorerImg from "../../assets/images/explorer.png";
import TwitterImg from "../../assets/images/twitter.png";
import TextImg from "../../assets/images/text.png";
import BootScreen from '../BiosBoot';
import { motion } from "framer-motion";

import "./style.css";
function HomeScreenComponent() {
  const [showWindow, setWindow] = React.useState(false);
  const [showWorkWindow, setWorkWindow] = React.useState(false);
  const [showPowerWindow, setPowerWindow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [iframeUrl, setUrl] = React.useState("");
  const [togglePower, setPower] = React.useState(false);
  const constraintsRef = React.useRef(null);
  const openProjectsPage = () => {
    setWorkWindow(!showWorkWindow);
  };
  const openAboutPage = () => {
    setUrl("https://shubham-agrawal.netlify.app/#/about");
    setWindow(true);
  };
  const openHomePage = () => {
    setUrl("https://shubham-agrawal.netlify.app/");
    setWindow(true);
  };
  const openChromePage = () => {
    setUrl("https://www.google.com/");
    setWindow(true);
  };
  const openGithubPage = () => {
    window.open("https://github.com/shubhamsWEB", '_blank');
  };
  const openLinkedInPage = () => {
    window.open("https://www.linkedin.com/in/shubham-agrawal-950078170/", '_blank');
  };
  const openTwitterPage = () => {
    window.open("https://twitter.com/devShubham_17", '_blank');
  };

  React.useEffect(() => {
    window.addEventListener("load", () => {
      setTimeout(function () {
        setIsLoading(false);
      }, 15000);
    });
  });

  return (
    <>
      {isLoading ? (
        <div className="loading-screen">
          <BootScreen/>
        </div>
      ) : (
        <>
          <Overlay togglePower={togglePower} setPower={setPower} />
          <motion.div ref={constraintsRef}>
            <div className="desktop">
              <div className="desktop-icons">
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={HomeImg}
                    title="My Portfolio"
                    onClick={openHomePage}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={AboutImg}
                    title="About Me"
                    onClick={openAboutPage}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={ProjectImg}
                    title="My Projects"
                    onClick={openProjectsPage}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={GithubImg}
                    title="GitHub"
                    small="medium_icon"
                    onClick={openGithubPage}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={ExplorerImg}
                    title="Explorer"
                    onClick={openChromePage}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={LinkedInImg}
                    title="Linked In"
                    small="medium_icon"
                    onClick={openLinkedInPage}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={TwitterImg}
                    title="Twitter"
                    small="medium_icon"
                    onClick={openTwitterPage}
                  />
                </motion.div>
              </div>

              <Dock
                togglePower={togglePower}
                setPower={setPower}
                setPowerWindow={setPowerWindow}
                showPowerWindow={showPowerWindow}
              />
              {showWindow && (
                <WindowScreen
                  setIsHidden={setWindow}
                  isHidden={showWindow}
                  constraintsRef={constraintsRef}
                >
                  <iframe
                    src={iframeUrl}
                    width="100%"
                    height="100%"
                    style={{ margin: 0, padding: 0 }}
                    title="Windows"
                  ></iframe>
                </WindowScreen>
              )}
              {showWorkWindow && (
                <WorkWindowScreen
                  setIsHidden={setWorkWindow}
                  isHidden={showWorkWindow}
                />
              )}
              {showPowerWindow && (
                <PowerWindowScreen
                  setIsHidden={setPowerWindow}
                  isHidden={showPowerWindow}
                  togglePower={togglePower}
                  setPower={setPower}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

export default HomeScreenComponent;
