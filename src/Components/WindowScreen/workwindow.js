import React from "react";
import { motion } from "framer-motion";
import AboutImg from "../../assets/images/users.png";
import FolderImg from "../../assets/images/file.png";
import ProjectImg from "../../assets/images/folder.png";
import DesktopIcon from "../DesktopIcons";
function WorkWindow({ isHidden, setIsHidden }) {
  const [maximize, setMaximize] = React.useState(false);
  const workWindowRef = React.useRef(null);

  const maximizeWindow = () => {
    setMaximize(!maximize);
  };
  const onClose = () => {
    setIsHidden(!isHidden);
  };
  return (
    <motion.div drag dragMomentum={false}>
      <div
        className={`window-custom ${maximize ? "full" : ""} ${
          !isHidden ? "hide" : "show"
        }`}
      >
        <div className="title-bar">
          <div className="title-bar-text">A Window With Stuff In It</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button
              aria-label={`${maximize ? "Restore" : "Maximize"}`}
              onClick={maximizeWindow}
            ></button>
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div class="status-bar">
          <ul className="status-bar-custom" style={{ listStyleType: "none" }}>
            <li>File</li>
            <li>Edit</li>
            <li>View</li>
            <li>Go</li>
            <li>Favorites</li>
            <li>Help</li>
          </ul>
        </div>
        <div className={`window-body-custom ${maximize ? "full" : ""}`}>
          <div className="work-window-container">
            <div className="flex1">
              <ul class="tree-view" style={{ height: "100%" }}>
                <li>Table of Contents</li>
                <li>What is web development?</li>
                <li>
                  CSS
                  <ul>
                    <li>Selectors</li>
                    <li>Specificity</li>
                    <li>Properties</li>
                  </ul>
                </li>
                <li>
                  <details open>
                    <summary>JavaScript</summary>
                    <ul>
                      <li>Avoid at all costs</li>
                      <li>
                        <details>
                          <summary>Unless</summary>
                          <ul>
                            <li>Avoid</li>
                            <li>
                              <details>
                                <summary>At</summary>
                                <ul>
                                  <li>Avoid</li>
                                  <li>At</li>
                                  <li>All</li>
                                  <li>Cost</li>
                                </ul>
                              </details>
                            </li>
                            <li>All</li>
                            <li>Cost</li>
                          </ul>
                        </details>
                      </li>
                    </ul>
                  </details>
                </li>
                <li>HTML</li>
                <li>Special Thanks</li>
              </ul>
            </div>
            <div className="flex2">
            <motion.div className="project-icon">
                <DesktopIcon
                  imgSrc={FolderImg}
                  title="Covid Tracker"
                  onClick={() => {
                    window.open("http://covid19.shubhamsweb.in/#/", "_blank");
                  }}
                />
              </motion.div >
              <motion.div className="project-icon">
                <DesktopIcon
                  imgSrc={FolderImg}
                  title="CrickBoard"
                  onClick={() => {
                    window.open("https://crickboard.herokuapp.com/", "_blank");
                  }}
                />
              </motion.div>
              <motion.div className="project-icon">
                <DesktopIcon
                  imgSrc={FolderImg}
                  title="Sudoku App"
                  onClick={() => {
                    window.open("http://sudoku.shubhamsweb.in/", "_blank");
                  }}
                />
              </motion.div>
              <motion.div className="project-icon">
                <DesktopIcon
                  imgSrc={FolderImg}
                  title="Inventory System"
                  onClick={() => {
                    window.open("http://inventory.shubhamsweb.in/", "_blank");
                  }}
                />
              </motion.div>
              <motion.div className="project-icon">
                <DesktopIcon
                  imgSrc={FolderImg}
                  title="E-wallet"
                  onClick={() => {
                    window.open("http://wallet.shubhamsweb.in/", "_blank");
                  }}
                />
              </motion.div>
              <motion.div className="project-icon">
                <DesktopIcon
                  imgSrc={FolderImg}
                  title="Movie Rating App"
                  onClick={() => {
                    window.open(
                      "https://shubhamsweb.github.io/Movieapp/",
                      "_blank"
                    );
                  }}
                />
              </motion.div>
              <motion.div className="project-icon">
                <DesktopIcon
                  imgSrc={FolderImg}
                  title="Samvid 2020"
                  onClick={() => {
                    window.open(
                      "https://shubhamsweb.github.io/MaachateRaho/",
                      "_blank"
                    );
                  }}
                />
              </motion.div>
              <motion.div className="project-icon">
                <DesktopIcon
                  imgSrc={FolderImg}
                  title="NPM Packages"
                  onClick={() => {
                    window.open(
                      "https://www.npmjs.com/settings/shubham_17/packages",
                      "_blank"
                    );
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WorkWindow;
