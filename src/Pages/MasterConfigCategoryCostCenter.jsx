import React, { useState, useEffect, useContext } from "react";
import MyContext from "../Context/ContextDetails";
import "./MasterConfigCategoryCostCenter.css";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../config/config.jsx";

const MasterConfigCategoryCostCenter = () => {
  const { publicKey } = useContext(MyContext);
  const { publicOrganization } = useContext(MyContext);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [PropertyOptions, setPropertyOptions] = useState([]);
  const [CategoryOptions, setCategoryOptions] = useState([]);
  const [LedgerName, setLedgerName] = useState("");
  const [selectedPrimaryCostCategoryName, setSelectedPrimaryCostCategoryName] = useState("");
  const [enableErrorTextFlag, setenableErrorTextFlag] = useState(false);
  const [errorText, setErrorText] = useState('');

  const apiurl =
    config.apiUrl.charAt(config.apiUrl.length - 1) != "/"
      ? config.apiUrl + "/"
      : "";

  
  const handlePropertyDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setLedgerName('');
    setSelectedPrimaryCostCategoryName('');
    setSelectedProperty(selectedValue);
    setenableErrorTextFlag(false);
    
    if (selectedValue) {
      try {
        const response = await fetch(
          apiurl + "TallyInterfaceInventoryCategoryMaster",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              PublicKey: publicKey,
              OrganizationId: selectedOrganization,
            },
          }
        );

        const data = await response.json();
        setCategoryOptions(data.tallyInterfaceInventoryCategoryMasterDetails);
      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
      }
    } else {
      setCategoryOptions([]); // Clear options if no valid selection
    }
  };


  const handleOrganizationDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedProperty('');
    setSelectedCategory('');
    setSelectedPrimaryCostCategoryName('');
    setLedgerName('');
    setSelectedOrganization(selectedValue);
    setenableErrorTextFlag(false);
    
    if (selectedValue) {
      try {
        const response = await fetch(
          apiurl + "TallyInterfaceInventoryPropertyMaster",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              PublicKey: publicKey,
              OrganizationId: selectedValue,
            },
          }
        );

        const data = await response.json();

        setPropertyOptions(data.tallyInterfaceInventoryPropertyMasterDetails);
      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
      }
    } else {
      setPropertyOptions([]); // Clear options if no valid selection
    }
  };
  const handleCategoryDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setLedgerName('');
    setSelectedPrimaryCostCategoryName('');
    setSelectedCategory(selectedValue);
    setenableErrorTextFlag(false);
    
if (selectedValue=='' ){
  return;
}
    const jsonData = {
      PropertyCode: selectedProperty,
      ConfigType: "categorycostcenter",
      PromisLedgerName: selectedValue,
    };

    if (selectedValue) {
      try {
        const response = await fetch(
          apiurl + "TallyInterfaceViewInventoryMaster",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              PublicKey: publicKey,
              OrganizationId: selectedOrganization,
            },
            body: JSON.stringify(
              jsonData
              // Include any data you need to send in the body
            ),
          }
        );

        const data = await response.json();
        if (data.tallyInterfaceInventoryMasterViewDetailsResponse.length>0){
          setLedgerName(
            data.tallyInterfaceInventoryMasterViewDetailsResponse[0]
              .tallyLedgerName
          );
          setSelectedPrimaryCostCategoryName(
            data.tallyInterfaceInventoryMasterViewDetailsResponse[0].otherValue1
          );
        }
      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
        //setLoading(false);
      }
    } else {
      setCategoryOptions([]); // Clear options if no valid selection
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setenableErrorTextFlag(false);

    if (selectedProperty == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Property Name')
      return;
    }

    if (selectedCategory == '') {
        setenableErrorTextFlag(true);
        setErrorText('Must Select the Category')
        return;
      }
  
    if (LedgerName == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Enter the Ledger Name')
      return;
    }
    if (selectedPrimaryCostCategoryName == '') {
        setenableErrorTextFlag(true);
        setErrorText('Must Enter the Primary Cost Category')
        return;
      }
    const jsonData = {
      PropertyCode: selectedProperty,
      ConfigType: "categorycostcenter",
      PromisLedgerName: selectedCategory,
      TallyLedgerName: LedgerName,
      TallyHead: "Fixed Assets",
      Percentage: 0,
      OtherValue1: selectedPrimaryCostCategoryName,
    };

    try {
      const response = await fetch(
        apiurl + "TallyInterfaceSaveInventoryMaster",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            PublicKey: publicKey,
            OrganizationId: selectedOrganization,
          },
          body: JSON.stringify(jsonData),
        }
      );

      const data = await response.json();

      setenableErrorTextFlag(true);
      setErrorText(data.message)
      
    } catch (error) {
      // console.error("Error fetching options:", error);
    } finally {
      //setLoading(false);
    }
  };

  return (
    <div className="MainContentCategoryCostCenter">
      <div className="container mt-3">
        <form className="FormDiv" onSubmit={handleSubmit}>
          <h5>Category Cost Center Configuration</h5>
          <br />
          <div className="mb-3">
            <label htmlFor="dropdownOrganization" className="form-label">
              Organization:
            </label>
            <select
              id="dropdownOrganization"
              className="form-select"
              onChange={handleOrganizationDropdownChange}
            >
              <option value="">Select the Organization</option>
              {publicOrganization.map((option) => (
                <option
                  key={option.organizationId}
                  value={option.organizationId}
                >
                  {option.organizationName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="second-dropdown" className="form-label">
              Property:
            </label>
            <select
              id="second-dropdown"
              className="form-select"
              onChange={handlePropertyDropdownChange}
            ><option key="-1" value="">Select the Property</option>
              {PropertyOptions.map((option) => (
                <option key={option.propertyCode} value={option.propertyCode}>
                  {option.propertyName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="second-dropdown" className="form-label">
              Category:
            </label>
            <select
              id="second-dropdown"
              className="form-select"
              onChange={handleCategoryDropdownChange}
            ><option key="-1" value="">Select the Category</option>
              {CategoryOptions.map((option) => (
                <option key={option.categoryName} value={option.categoryName}>
                  {option.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="txtLedgerName" className="form-label">
              Ledger Name:
            </label>
            <input
              type="text"
              id="txtLedgerName"
              value={LedgerName}
              className="form-control"
              onChange={(e) => setLedgerName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="txtPrimaryCostCategory" className="form-label">
              Primary Cost Category:
            </label>
            <input
              type="text"
              id="txtPrimaryCostCategory"
              value={selectedPrimaryCostCategoryName}
              className="form-control"
              onChange={(e) => setSelectedPrimaryCostCategoryName(e.target.value)}
            />
          </div>

        

          <br />
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          {/* <br /> */}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {enableErrorTextFlag && <label className="ErrorTextClass">{errorText}</label>}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </form>
      </div>
    </div>
  );
};

export default MasterConfigCategoryCostCenter;