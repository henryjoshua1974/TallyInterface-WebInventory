import React, { useState, useEffect, useContext } from "react";
import MyContext from "../Context/ContextDetails";
import TallyHead from "./TallyHead";
import "./MasterConfigCategory.css";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../config/config.jsx";

const MasterConfigCategory = () => {
  const { publicKey } = useContext(MyContext);
  const { publicOrganization } = useContext(MyContext);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTallyHead, setSelectedTallyHead] = useState("");
  const [CategoryOptions, setCategoryOptions] = useState([]);
  const [LedgerName, setLedgerName] = useState("");
  const [enableErrorTextFlag, setenableErrorTextFlag] = useState(false);
  const [enableSuccessTextFlag, setenableSuccessTextFlag] = useState(false);
  const [errorText, setErrorText] = useState('');

  const apiurl =
    config.apiUrl.charAt(config.apiUrl.length - 1) != "/"
      ? config.apiUrl + "/"
      : "";

  const handleCategoryDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setLedgerName('');
    setSelectedTallyHead('');
    setSelectedCategory(selectedValue);

    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false )

if (selectedValue=='' ){
  return;
}
    const jsonData = {
      PropertyCode: "0",
      ConfigType: "category",
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
        setLedgerName(
          data.tallyInterfaceInventoryMasterViewDetailsResponse[0]
            .tallyLedgerName
        );
        setSelectedTallyHead(
          data.tallyInterfaceInventoryMasterViewDetailsResponse[0].tallyHead
        );
      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
        //setLoading(false);
      }
    } else {
      setCategoryOptions([]); // Clear options if no valid selection
    }
  };

  const handleTallyHeadDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTallyHead(selectedValue);
  };

  const handleOrganizationDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setLedgerName('');
    setSelectedTallyHead('');
    setSelectedOrganization(selectedValue);
    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false )
    if (selectedValue) {
      try {
        const response = await fetch(
          apiurl + "TallyInterfaceInventoryCategoryMaster",
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
        
        setCategoryOptions(data.tallyInterfaceInventoryCategoryMasterDetails);
      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
      }
    } else {
      setCategoryOptions([]); // Clear options if no valid selection
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false )

    if (selectedOrganization == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Organization Name')
      return;
    }

    
    if (selectedCategory == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Category Name')
      return;
    }

    if (LedgerName == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Enter the Ledger Name')
      return;
    }

    const jsonData = {
      PropertyCode: "0",
      ConfigType: "category",
      PromisLedgerName: selectedCategory,
      TallyLedgerName: LedgerName,
      TallyHead: selectedTallyHead,
      Percentage: 0,
      OtherValue1: "",
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

      // alert(data.message);
      setenableErrorTextFlag(true);
      setErrorText(data.message)
      if (data.errorCode==0){
        setenableSuccessTextFlag(true)
        setErrorText("Data Updated Successfully")
      }
    } catch (error) {
      // console.error("Error fetching options:", error);
    } finally {
      //setLoading(false);
    }
  };

  return (
    <div className="MainContentCategory">
      <div className="container mt-3">
        <form className="FormDiv" onSubmit={handleSubmit}>
          <h5>Category Configuration</h5>
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
            <label htmlFor="dropdownTallyHead" className="form-label">
              TallyHead:
            </label>
            <select
              id="dropdownTallyHead"
              className="form-select"
              value={selectedTallyHead}
              onChange={handleTallyHeadDropdownChange}
            >
              <option value="">Select an option</option>
              {TallyHead.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <br />
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <br />
          {/* {enableErrorTextFlag && <label  className="ErrorTextClass">{errorText}</label>} */}
          {enableErrorTextFlag && <label  className={(enableSuccessTextFlag)?"SuccessTextClass":"ErrorTextClass"}>{errorText}</label>}
        </form>
      </div>
    </div>
  );
};

export default MasterConfigCategory;
