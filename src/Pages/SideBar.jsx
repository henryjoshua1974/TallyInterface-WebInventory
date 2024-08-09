import React, { useState, useEffect } from "react";
import "./SideBar.css";
import imgCategory from "../assets/menuimages/category.png";
import imgSupplier from "../assets/menuimages/supplier.png";
import imgTax from "../assets/menuimages/tax.png";
import imgTaxStructure from "../assets/menuimages/taxstructure.png";
import imgCategoryCostCenter from "../assets/menuimages/categorycostcenter.png";
import imgPropertyCostCenter from "../assets/menuimages/propertycostcenter.png";
import imgDataTransfer from "../assets/menuimages/datatransfer.png";
import imgGeneralSettings from "../assets/menuimages/generalsettings.png";
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
              <div
                className={
                  selectedButtonCode == "1" ? "selectedimgdiv" : "imgbuton"
                }
              >
                <img
                  src={imgDataTransfer}
                  alt="Logo"
                  className="sidebar-image"
                />

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
        </div>
        <br />

        <div>
          <div>
            <label>Master Configuration</label>
          </div>
          <div className="contentdiv">
            <div>&nbsp;</div>

            <div className="buttondiv">
              {/* <div className="imgbuton"> */}
              <div
                className={
                  selectedButtonCode == "5" ? "selectedimgdiv" : "imgbuton"
                }
              >
                <img src={imgCategory} alt="Logo" className="sidebar-image" />
                <button
                  className={selectedButtonCode == "5" ? "selected" : ""}
                  onClick={() => {
                    setselectedButtonCode("5");
                    setActiveComponent("MasterConfigCategory");
                  }}
                >
                  Category
                </button>
              </div>

              <div
                className={
                  selectedButtonCode == "6" ? "selectedimgdiv" : "imgbuton"
                }
              >
                <img src={imgSupplier} alt="Logo" className="sidebar-image" />
                <button
                  className={selectedButtonCode == "6" ? "selected" : ""}
                  onClick={() => {
                    setselectedButtonCode("6");
                    setActiveComponent("MasterConfigSupplier");
                  }}
                >
                  Supplier
                </button>
              </div>
              <div
                className={
                  selectedButtonCode == "7" ? "selectedimgdiv" : "imgbuton"
                }
              >
                <img src={imgTax} alt="Logo" className="sidebar-image" />
                <button
                  className={selectedButtonCode == "7" ? "selected" : ""}
                  onClick={() => {
                    setselectedButtonCode("7");
                    setActiveComponent("MasterConfigTax");
                  }}
                >
                  Tax
                </button>
              </div>
              <div
                className={
                  selectedButtonCode == "8" ? "selectedimgdiv" : "imgbuton"
                }
              >
                <img
                  src={imgTaxStructure}
                  alt="Logo"
                  className="sidebar-image"
                />

                <button
                  className={selectedButtonCode == "8" ? "selected" : ""}
                  onClick={() => {
                    setselectedButtonCode("8");
                    setActiveComponent("MasterConfigTaxStructure");
                  }}
                >
                  Tax Structure
                </button>
              </div>
              <div
                className={
                  selectedButtonCode == "9" ? "selectedimgdiv" : "imgbuton"
                }
              >
                <img
                  src={imgPropertyCostCenter}
                  alt="Logo"
                  className="sidebar-image"
                />

                <button
                  className={selectedButtonCode == "9" ? "selected" : ""}
                  onClick={() => {
                    setselectedButtonCode("9");
                    setActiveComponent("MasterConfigPropertyCostCenter");
                  }}
                >
                  Property Cost Center
                </button>
              </div>
              <div
                className={
                  selectedButtonCode == "10" ? "selectedimgdiv" : "imgbuton"
                }
              >
                <img
                  src={imgCategoryCostCenter}
                  alt="Logo"
                  className="sidebar-image"
                />

                <button
                  className={selectedButtonCode == "10" ? "selected" : ""}
                  onClick={() => {
                    setselectedButtonCode("10");
                    setActiveComponent("MasterConfigCategoryCostCenter");
                  }}
                >
                  Category Cost Center
                </button>
              </div>

              <div
                className={
                  selectedButtonCode == "11" ? "selectedimgdiv" : "imgbuton"
                }
              >
                <img
                  src={imgGeneralSettings}
                  alt="Logo"
                  className="sidebar-image"
                />
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
    </div>
  );
};

export default Sidebar;
