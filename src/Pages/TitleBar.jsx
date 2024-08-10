import React, { useContext, useState, useRef } from "react";
import "./TitleBar.css"; // Create this file for styling
import imgLogo from "../assets/promisICO.png";
import imgUserLogin from "../assets/userlogin.png";

import { useNavigate } from "react-router-dom";
import MyContext from "../Context/ContextDetails";

const TitleBar = () => {
  const navigate = useNavigate();
  const { publicLoginName } = useContext(MyContext);
  const { assignPublicKey } = useContext(MyContext);
  const { assignLoginName } = useContext(MyContext);

  const [showMenu, setShowMenu] = useState(false);
  const handleMouseEnter = () => {
    console.log("mouseenter");
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    console.log("mouseleave");
    setShowMenu(false);
  };

  const ProcessLogin = () => {
    assignPublicKey("");

    assignLoginName("");
    navigate(`/`);
  };

  return (
    <div className="title-bar">
      <div className="left-section">
        <img src={imgLogo} alt="Logo" className="logo" />
        {/* <div className="titlelabel">Tally Interface</div> */}
        <h5>Tally Interface</h5>
      </div>

      <div className="right-section">

        <div className="loginimagediv"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img src={imgUserLogin} alt="Logo" className="loginlogo" />

          {showMenu && (
            <div className="menudiv">

              <ul className="ulstyle">
                <li >
                <button className="logoutbutton" onClick={ProcessLogin}>Logout {publicLoginName}</button>
                </li>
               
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
