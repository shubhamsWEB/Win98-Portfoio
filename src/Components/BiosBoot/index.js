import React from "react";
import './style.scss';
function Boot() {
  const BiosRef = React.useRef('');
  const[isBooting,setBooting] = React.useState(true);
  React.useEffect(() => {
    for(let i = 0; i < BiosRef.current.children.length; i++) {
      setTimeout(function timer() {
        BiosRef.current.children[i].style.visibility ="visible";
        if(i ===BiosRef.current.children.length-1) {
         setBooting(false);
        }
      }, i * 1000);
      }
  },[])
  return (
    <>
    {isBooting ?
      (<div className="BIOSWrapper">
        <div className="BIOS" ref={BiosRef}>
          <div className="BIOS__logo"></div>
          <div className="BIOS__bootHeader">
            <p>AMII BIOS (C) 1992-2021</p>
            <p>BIOS Version 16.8.3.REACT</p>
            <p>PENTIUM III CPU at 450WHz</p>
          </div>
          <div className="BIOS__bootMessage1">
            Memory Test : 98394k OK
          </div>
          <div className="BIOS__bootMessage3">
            Detecting I/O Devices....
          </div>
          <div className="BIOS__bootMessage4">
            Keyboard... <span>detected</span>
          </div>
          <div className="BIOS__bootMessage5">
            Mouse/digitizer... <span>detected</span>
          </div>
          <div className="BIOS__bootMessage6">
            <p>
              Detecting HDD Primary Master ...SDHEA453
            </p>
          </div>
          <div className="BIOS__bootMessage7">
          <p>THIS SITE MAY NOT BE COMPATIABLE ON MOBILE PHONES</p>
          <p>FOR BEST UI EXPERIENCE VIEW IN LAPTOPS/DESKTOPS</p>
          </div>
          <div className="BIOS__bootMessage8">
           Booting Up Windows....
          </div>
          <div className="BIOS__bootMessage9">
           Boot Success!
          </div>
          <div className="BIOS__bootMessage10">
           ***WELCOME TO SHUBHAMSWEB***
          </div>
        </div>
      </div>) :
        (<div className="WindowsLaunch-screen"></div>)
}
    </>
  );
}

export default Boot;

