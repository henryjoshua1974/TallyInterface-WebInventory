import React, { useState, useEffect, useContext } from 'react'
import './Login.css'
import MainPage from './MainPage';
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context/ContextDetails';
import config from '../config/config.jsx';
import promisicon from '../assets/promisICO.ico'



function Login() {
  const [execAPIFlag, setexecAPIFlag] = useState(false);
  const [valueUserID, setValueUserID] = useState('VRO@BNG');
  const [valuePassword, setValuePassword] = useState('vro@bng_020422');
  const [logindata, setData] = useState(null);
  const [errorFlag, setErrorflag] = useState(false);
  const [loginErrorFlag, setLoginErrorflag] = useState(false);
  const [showDataFetcher, setShowDataFetcher] = useState(false);

  const navigate = useNavigate();

  const { assignPublicKey } = useContext(MyContext);
  const { assignPublicOrganization } = useContext(MyContext);
  const { assignLoginName } = useContext(MyContext);

  const apiurl = (config.apiUrl.charAt(config.apiUrl.length - 1) != '/' ? config.apiUrl + '/' : '');

  useEffect(() => {

    if (execAPIFlag) {
      // Perform the POST request here
      // setLoginErrorflag(false);
      fetch(apiurl + 'TallyInterfaceInventoryVerifyUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'UserId': valueUserID,
          'Password': valuePassword
        },
        // body: JSON.stringify({
        //     // Include any data you need to send in the body
        // })
      })
        .then(response => response.json())
        .then(data => {
          // Update state with the fetched data
          setData(data);
          setShowDataFetcher(true);
          // console.log('showdatafetcher value:'+ showDataFetcher)
        })
        .catch(error => {
          // Handle errors here
          console.error('Error fetching data:', error);
          setErrorflag(true);
        })
        .finally(() => {
          // Reset the trigger
          setexecAPIFlag(false);
        });
    }
  }, [execAPIFlag]); // useEffect will run whenever triggerFetch changes


  useEffect(() => {
    // console.log('inside login'+showDataFetcher );

    if (showDataFetcher) {

      setLoginErrorflag(false);
      if (logindata.errorCode == 0) {
        assignPublicKey(logindata.public_Key);
        assignPublicOrganization(logindata.tallyInterfaceInventoryOrganizationMasterDetails);
        assignLoginName(valueUserID)
        navigate(`/MainPage`);
      }
      else {
        setLoginErrorflag(true);
      }

    }
    setShowDataFetcher(false);

  }, [showDataFetcher]);


  // Handler to update state when input changes for value1
  const handleUserIDChange = (event) => {
    setValueUserID(event.target.value);
  };

  // Handler to update state when input changes for value2
  const handlePasswordChange = (event) => {
    setValuePassword(event.target.value);
  };

  const handleClick = () => {

    setexecAPIFlag(true);





  };


  return (
    <div className="LoginMainContainer">
      <div className="LoginSubContainer">
        <div className="LoginProductDetailsContainer">
          <div className='promicicotext'>
            <img className='promisico' src={promisicon} alt="Lucid Promis" />
            <div className='spaceprovider'></div>
            <h4>Lucid Tally Interface</h4>
          </div>
          <div className='TallyInterfaceDesc'>Tally Interface, is designed to bridge the gap between 
            your business operations and Tally's robust accounting features.</div>

        </div>
        <div className="login-container">
          <h4>Sign in</h4>

          <label htmlFor="username">Username</label>
          <input type="text"
            id="username"
            name="username"
            value={valueUserID}
            placeholder="Your username.."
            required
            onChange={handleUserIDChange} />

          <label htmlFor="password">Password</label>
          <input type="password"
            id="password"
            name="password"
            value={valuePassword}
            placeholder="Your password.."
            required
            onChange={handlePasswordChange} />

          <button className="LoginButton" onClick={() => handleClick()} >Login</button>

          {loginErrorFlag && <div className='Errordiv'>{logindata.message}</div>}
          {errorFlag && <div className='Errordiv'>Error Occured, Kindly Contact Lucid IT Solutions.</div>}



        </div>
      </div>
    </div>
  )
}

export default Login
