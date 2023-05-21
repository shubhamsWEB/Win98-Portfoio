import React from "react";
import Dock from "../Dock";
import DesktopIcon from "../DesktopIcons";
// const Dock = lazy(() => import('../Dock'));
import WindowScreen from "../WindowScreen";
import PowerWindowScreen from "../WindowScreen/powerwindow";
import WorkWindowScreen from "../WindowScreen/workwindow";
import FormWindowScreen from "../WindowScreen/messageFormWindow";
import Overlay from "../Overlay";

import SuccessWindow from "../WindowScreen/successWindow";
import FailedWindow from "../WindowScreen/failedWindow";
import MiniGameWindow from "../WindowScreen/miniGameWindow";
import CalanderWindow from "../WindowScreen/calendarWindow";
import BootScreen from "../BiosBoot";
import { motion } from "framer-motion";

import "./style.css";
const AboutImg = require("../../assets/images/users.png").default;
const HomeImg = require("../../assets/images/computer.png").default;
const ProjectImg = require("../../assets/images/folder.png").default;
const GithubImg = require("../../assets/images/github.png").default;
const LinkedInImg = require("../../assets/images/linkedin.png").default;
const ExplorerImg = require("../../assets/images/explorer.png").default;
const TwitterImg = require("../../assets/images/twitter.png").default;
const SudokuImg = require("../../assets/images/sudokuicon.webp").default;
const MarioImg = require("../../assets/images/mario.png").default;
const MessageImg = require("../../assets/images/message.png").default;
const CalanderImg = require("../../assets/images/calendar.png").default;
const BlogImg = require("../../assets/images/blog.png").default;
function HomeScreenComponent() {
  const [showWindow, setWindow] = React.useState(false);
  const [showWorkWindow, setWorkWindow] = React.useState(false);
  const [showMessageWindow, setMessageWindow] = React.useState(false);
  const [showMiniGameWindow, setMiniGameWindow] = React.useState(false);
  const [showCalendarWindow, setCalendarWindow] = React.useState(false);
  const [emailSent, setEmail] = React.useState(false);
  const [emailSentError, setEmailError] = React.useState(false);
  const [showPowerWindow, setPowerWindow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [iframeUrl, setUrl] = React.useState("");
  const [togglePower, setPower] = React.useState(false);
  const [windowTitle, setWindowTitle] = React.useState("");
  const constraintsRef = React.useRef(null);
  const openProjectsPage = () => {
    setWorkWindow(!showWorkWindow);
  };
  const openMessageForm = () => {
    setMessageWindow(!showMessageWindow);
  };
  const openMiniGame = () => {
    setMiniGameWindow(!showMiniGameWindow);
  };
  const openCalendar = () => {
    setCalendarWindow(!showCalendarWindow);
  };
  const openAboutPage = () => {
    setUrl("https://shubham-agrawal.netlify.app/#/about");
    setWindowTitle("About Shubham Agrawal");
    setWindow(true);
  };
  const openBlogPage = () => {
    window.open('https://shubhamsweb.hashnode.dev/', '_blank');
  };
  const openHomePage = () => {
    setUrl("https://shubham-agrawal.netlify.app/");
    setWindowTitle("Its Me Shubham Agrawal");
    setWindow(true);
  };
  const openChromePage = () => {
    setUrl("https://www.google.com/");
    setWindowTitle("Ah! Just open it on Google!! :/");
    setWindow(true);
  };
  const openSudokuApp = () => {
    setUrl("https://thirsty-sammet-d9cce0.netlify.app/");
    setWindowTitle("Sudoku App");
    setWindow(true);
  };
  const openGithubPage = () => {
    window.open("https://github.com/shubhamsWEB", "_blank");
  };
  const openLinkedInPage = () => {
    window.open(
      "https://www.linkedin.com/in/shubham-agrawal-950078170/",
      "_blank"
    );
  };
  const openTwitterPage = () => {
    window.open("https://twitter.com/devShubham_17", "_blank");
  };

  React.useEffect(() => {
    setTimeout(function () {
      setIsLoading(false);
    }, 12000);
  });

  return (
    <>
      {isLoading ? (
        <div className="loading-screen">
          <BootScreen />{" "}
        </div>
      ) : (
        <>
          <Overlay togglePower={togglePower} setPower={setPower} />
          <motion.div ref={constraintsRef}>
            <div className="desktop">
              <div
                className="desktop-icons"
                style={{
                  display: "grid",
                  gridTemplateRows: "auto auto auto auto",
                  gridTemplateColumns: "auto auto",
                }}
              >
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
                    imgSrc={BlogImg}
                    title="Blogs"
                    onClick={openBlogPage}
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
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={SudokuImg}
                    title="Sudoku"
                    small="medium_icon"
                    onClick={openSudokuApp}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={MessageImg}
                    title="Send a Message"
                    // small="small_icon"
                    onClick={openMessageForm}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={MarioImg}
                    title="Super Mario"
                    small="medium_icon"
                    onClick={openMiniGame}
                  />
                </motion.div>
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  dragMomentum={false}
                >
                  <DesktopIcon
                    imgSrc={CalanderImg}
                    title="Calendar"
                    // small="medium_icon"
                    onClick={openCalendar}
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
                  title={windowTitle}
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
              {emailSent && (
                <SuccessWindow setIsHidden={setEmail} isHidden={emailSent} />
              )}
              {emailSentError && (
                <FailedWindow
                  setIsHidden={setEmailError}
                  isHidden={emailSentError}
                />
              )}
              {showWorkWindow && (
                <WorkWindowScreen
                  setIsHidden={setWorkWindow}
                  isHidden={showWorkWindow}
                />
              )}
              {showMessageWindow && (
                <FormWindowScreen
                  setIsHidden={setMessageWindow}
                  isHidden={showMessageWindow}
                  setError={setEmailError}
                  setSuccess={setEmail}
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
              {showMiniGameWindow && (
                <MiniGameWindow
                  isHidden={showMiniGameWindow}
                  setIsHidden={setMiniGameWindow}
                />
              )}
              {showCalendarWindow&&<CalanderWindow isHidden={showCalendarWindow} setIsHidden={setCalendarWindow}/>}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

export default HomeScreenComponent;
