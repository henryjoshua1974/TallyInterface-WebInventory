import React, { useState,useEffect } from "react";
import "./SideBar.css";

const Sidebar = ({ setActiveComponent }) => {
  const [selectedButtonCode, setselectedButtonCode] = useState("");


  useEffect(() => {
  setselectedButtonCode("1");
  }, []);



  return (
    <div className="sidebar">
      <div>
        <div>
          <div>
            <label>Data Transfer</label>
          </div>

          <div className="contentdiv">
            <div>&nbsp;</div>
            <div className="buttondiv">
              <button
                className={selectedButtonCode == "1" ? "selected" : ""}
                onClick={() => {
                  setselectedButtonCode("1");
                  setActiveComponent("TransferTransactionData");
                }}
              >
                Transfer Data
              </button>
            </div>
          </div>
        </div>
        <br />

        <div>
          <div>
            <label>Master Configuration</label>
          </div>
          <div className="contentdiv">
            <div>&nbsp;</div>
            <div className="buttondiv">
              <button
                className={selectedButtonCode == "5" ? "selected" : ""}
                onClick={() => {
                  setselectedButtonCode("5");
                  setActiveComponent("MasterConfigCategory");
                }}
              >
                Category
              </button>
              <button
                className={selectedButtonCode == "6" ? "selected" : ""}
                onClick={() => {
                  setselectedButtonCode("6");
                  setActiveComponent("MasterConfigSupplier");
                }}
              >
                Supplier
              </button>
              <button
                className={selectedButtonCode == "7" ? "selected" : ""}
                onClick={() => {
                  setselectedButtonCode("7");
                  setActiveComponent("MasterConfigTax");
                }}
              >
                Tax
              </button>
              <button
                className={selectedButtonCode == "8" ? "selected" : ""}
                onClick={() => {
                  setselectedButtonCode("8");
                  setActiveComponent("MasterConfigTaxStructure");
                }}
              >
                Tax Structure
              </button>
              <button
                className={selectedButtonCode == "9" ? "selected" : ""}
                onClick={() => {
                  setselectedButtonCode("9");
                  setActiveComponent("MasterConfigPropertyCostCenter");
                }}
              >
                Property Cost Center
              </button>
              <button
                className={selectedButtonCode == "10" ? "selected" : ""}
                onClick={() => {
                  setselectedButtonCode("10");
                  setActiveComponent("MasterConfigCategoryCostCenter");
                }}
              >
                Category Cost Center
              </button>
              <button
                className={selectedButtonCode == "11" ? "selected" : ""}
                onClick={() => {
                  setselectedButtonCode("11");
                  setActiveComponent("MasterConfigSettings");
                }}
              >
                General Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
