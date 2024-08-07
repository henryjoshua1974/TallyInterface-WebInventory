import React,{useContext} from 'react';
import './TitleBar.css'; // Create this file for styling
import imgLogo from '../assets/promisICO.ico'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context/ContextDetails';

const TitleBar = () => {
  const navigate = useNavigate();
  const {publicLoginName} = useContext(MyContext);
  const {assignPublicKey}= useContext(MyContext);
  const {assignLoginName}= useContext(MyContext);
  
  const ProcessLogin=()=> {
    assignPublicKey('');
    
    assignLoginName('')
    navigate(`/`);
  }

  
  return (
    <div className="title-bar">
      <div className="left-section">
        <img src={imgLogo} alt="Logo" className="logo" />
        
        <div className="options">
        <label className="titlelabel">Lucid Tally Interface</label>
          {/* <a href="#configuration">Configuration</a>
          <a href="#reports">Reports</a> */}
        </div>
      </div>
      <div className="right-section">
        {/* <button className="login-button" onClick={ProcessLogin}>Logout</button> */}
        <div className="titlelabel">{publicLoginName}</div>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <a className="login-link" onClick={ProcessLogin}> Logout </a>
      </div>
    </div>
  );
};

export default TitleBar;
