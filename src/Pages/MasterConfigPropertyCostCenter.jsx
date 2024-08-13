import React, { useState, useEffect, useContext } from "react";
import MyContext from "../Context/ContextDetails";
import "./MasterConfigPropertyCostCenter.css";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../config/config.jsx";

const MasterConfigPropertyCostCenter = () => {
  const { publicKey } = useContext(MyContext);
  const { publicOrganization } = useContext(MyContext);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [PropertyOptions, setPropertyOptions] = useState([]);
  const [LedgerName, setLedgerName] = useState("");
  const [selectedPrimaryCostPropertyName, setSelectedPrimaryCostPropertyName] = useState("");
  const [enableErrorTextFlag, setenableErrorTextFlag] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [enableSuccessTextFlag, setenableSuccessTextFlag] = useState(false);

  const apiurl =
    config.apiUrl.charAt(config.apiUrl.length - 1) != "/"
      ? config.apiUrl + "/"
      : "";

  const handlePropertyDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setLedgerName("");
    setSelectedPrimaryCostPropertyName("");
    setSelectedProperty(selectedValue);
    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false);

    if (selectedValue == "") {
      return;
    }
    
    const jsonData = {
      PropertyCode: "0",
      ConfigType: "Propertycostcenter",
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
        if (data.tallyInterfaceInventoryMasterViewDetailsResponse.length > 0) {
          setLedgerName(
            data.tallyInterfaceInventoryMasterViewDetailsResponse[0]
              .tallyLedgerName
          );
          setSelectedPrimaryCostPropertyName(
            data.tallyInterfaceInventoryMasterViewDetailsResponse[0].otherValue1
          );
        }
      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
        //setLoading(false);
      }
    } else {
    //    // Clear options if no valid selection
    }
  };

  const handleOrganizationDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedProperty("");
    setSelectedPrimaryCostPropertyName("");
    setLedgerName("");
    setSelectedOrganization(selectedValue);
    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false);

    if (selectedProperty == "") {
      setenableErrorTextFlag(true);
      setErrorText("Must Select the Property");
      return;
    }

    if (LedgerName == "") {
      setenableErrorTextFlag(true);
      setErrorText("Must Enter the Ledger Name");
      return;
    }
    if (selectedPrimaryCostPropertyName == "") {
      setenableErrorTextFlag(true);
      setErrorText("Must Enter the Primary Cost Property");
      return;
    }
    const jsonData = {
      PropertyCode: "0",
      ConfigType: "Propertycostcenter",
      PromisLedgerName: selectedProperty,
      TallyLedgerName: LedgerName,
      TallyHead: "Fixed Assets",
      Percentage: 0,
      OtherValue1: selectedPrimaryCostPropertyName,
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
      setErrorText(data.message);
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
    <div className="MainContentPropertyCostCenter">
      <div className="container mt-3">
        <form className="FormDiv" onSubmit={handleSubmit}>
          <h5>Property Cost Center Configuration</h5>
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
            >
              <option key="-1" value="">
                Select the Property
              </option>
              {PropertyOptions.map((option) => (
                <option key={option.propertyCode} value={option.propertyName}>
                  {option.propertyName}
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
            <label htmlFor="txtPrimaryCostProperty" className="form-label">
              Primary Cost Property:
            </label>
            <input
              type="text"
              id="txtPrimaryCostProperty"
              value={selectedPrimaryCostPropertyName}
              className="form-control"
              onChange={(e) =>
                setSelectedPrimaryCostPropertyName(e.target.value)
              }
            />
          </div>
          <br />
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <br />
          
          {enableErrorTextFlag && (
            <label className={(enableSuccessTextFlag)?"SuccessTextClass":"ErrorTextClass"}>{errorText}</label>
          )}
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

export default MasterConfigPropertyCostCenter;
