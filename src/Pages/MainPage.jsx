import React, { useContext, useState,useEffect } from "react";
import MyContext from "../Context/ContextDetails";
import "./MainPage.css";
import Sidebar from "./SideBar";
import TitleBar from "./TitleBar";
import MasterConfigCategory from "./MasterConfigCategory";
import TransferData from "./TransferData";
import MasterConfigSupplier from "./MasterConfigSupplier";
import MasterConfigTaxStructure from "./MasterConfigTaxStructure";
import MasterConfigCategoryCostCenter from "./MasterConfigCategoryCostCenter";
import MasterConfigPropertyCostCenter from "./MasterConfigPropertyCostCenter";
import MasterConfigTax from "./MasterConfigTax";
import MasterConfigSettings from "./MasterConfigSettings";
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const [value, setValue] = React.useState(0);
  const { publicKey } = useContext(MyContext);
  const [activeComponent, setActiveComponent] = useState(
    "TransferTransactionData"
  );


// Handling Page Expiry
  const navigate = useNavigate();

  const handleExpiry = () => {
    if (publicKey == '' )
      navigate(`/`);

  }

  useEffect(() => {
    handleExpiry();
  }, [publicKey]); 
// Handling Page Expiry




  const renderContent = () => {
    switch (activeComponent) {
      case "MasterConfigCategory":
        return <MasterConfigCategory />;
      case "MasterConfigSupplier":
        return <MasterConfigSupplier />;
      case "TransferTransactionData":
        return <TransferData />;
      case "MasterConfigTax":
        return <MasterConfigTax />;
      case "MasterConfigTaxStructure":
        return <MasterConfigTaxStructure />;
      case "MasterConfigCategoryCostCenter":
        return <MasterConfigCategoryCostCenter />;
      case "MasterConfigPropertyCostCenter":
        return <MasterConfigPropertyCostCenter />;
        case "MasterConfigSettings":
          return <MasterConfigSettings />;
  
        default:
      //   return <Home />;
    }
  };
  //Newly Added Code Ends

  return (
    
    
    <div className="MainContainer">
      <TitleBar />
      <div className="MainDiv">
        <div className="left-container">
          <Sidebar setActiveComponent={setActiveComponent} />
        </div>
        <div className="middle-container">{renderContent()}</div>

        {/* <div className="right-container">
          <h1>right container</h1>
        </div> */}

      </div>
    </div>


  );
}
