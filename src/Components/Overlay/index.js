import React from "react";

function Overlay({togglePower, setPower}) {
  return (
    <div className={`overlay ${togglePower ? 'on' : ''}`}>
      <div className="turn-on-computer">
        <svg
          className="svg-container"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="100px"
          height="100px"
          viewBox="0 0 100 100"
          enable-background="new 0 0 100 100"
        >
          <g>
            <path
              className="power-button"
              onClick={() => {setPower(!togglePower)}}
              fill="#444"
              d="M49.999,74.194c-13.118,0-23.791-10.674-23.791-23.793c0-4.884,1.47-9.58,4.253-13.578
		c1.663-2.393,4.95-2.985,7.343-1.318c2.392,1.664,2.982,4.953,1.318,7.344c-1.546,2.222-2.363,4.833-2.363,7.552
		c0,7.302,5.939,13.241,13.239,13.241c7.301,0,13.24-5.939,13.24-13.241c0-2.958-0.953-5.754-2.758-8.089
		c-1.781-2.306-1.356-5.619,0.948-7.4c2.306-1.787,5.618-1.357,7.401,0.948c3.244,4.199,4.96,9.229,4.96,14.542
		C73.791,63.521,63.118,74.194,49.999,74.194z"
            />
          </g>
          <g>
            <path
              className="power-button"
              fill="#444"
              d="M49.999,54c-3.17,0-5.74-2.572-5.74-5.742v-16.71c0-3.17,2.57-5.74,5.74-5.74c3.171,0,5.74,2.57,5.74,5.74
		v16.71C55.739,51.428,53.17,54,49.999,54z"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Overlay;
