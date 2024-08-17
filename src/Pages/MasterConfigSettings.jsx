import React, { useState, useEffect, useContext } from "react";
import MyContext from "../Context/ContextDetails";
import "./MasterConfigSettings.css";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../config/config.jsx";

const MasterConfigSettings = () => {
  const { publicKey } = useContext(MyContext);
  const { publicOrganization } = useContext(MyContext);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedTransferType, setSelectedTransferType] = useState("");
  const [PropertyOptions, setPropertyOptions] = useState([]);
  const [SettingsOptions, setSettingsOptions] = useState([
    {
      id: 1,
      optionValue: "Categorywise",
    },
    {
      id: 2,
      optionValue: "Tax Structure Name",
    },
  ]);
  const [enableErrorTextFlag, setenableErrorTextFlag] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [enableSuccessTextFlag, setenableSuccessTextFlag] = useState(false);

  const apiurl =
    config.apiUrl.charAt(config.apiUrl.length - 1) != "/"
      ? config.apiUrl + "/"
      : "";

  const [isCheckedSendTaxDetails, setIsCheckedSendTaxDetails] = useState(false);

  const handleCheckboxChange = () => {
    setIsCheckedSendTaxDetails(!isCheckedSendTaxDetails);
  };

  const handleTransferTypeDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTransferType(selectedValue);
    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false)
  };

  const fetchCheckTaxDetailsbyDefault = async (objSelectedProperty) => {
    const jsonData = {
      PropertyCode: objSelectedProperty,
      ConfigType: "purchasetaxtosend",
      PromisLedgerName: "purchasetaxtosend"
    };
    
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
        setIsCheckedSendTaxDetails(
          (data.tallyInterfaceInventoryMasterViewDetailsResponse[0].tallyLedgerName=='0'?
            false:true));
      }


    } catch (error) {
      // console.error("Error fetching options:", error);
      setTaxOptions([]);
    } finally {
      //setLoading(false);
    }
  };


  const handlePropertyDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedProperty(selectedValue);
    setSelectedTransferType("");
    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false)

    const jsonData = {
      PropertyCode: selectedValue,
      ConfigType: "inventorytransfertype",
      PromisLedgerName: "inventorytransfertype",
    };

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
        setSelectedTransferType(
          data.tallyInterfaceInventoryMasterViewDetailsResponse[0]
            .tallyLedgerName
        );
       await fetchCheckTaxDetailsbyDefault(selectedValue);        

      }
    } catch (error) {
      // console.error("Error fetching options:", error);
    } finally {
      //setLoading(false);
    }
  };

  const handleOrganizationDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedTransferType("");
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

  const saveCheckTaxDetailsbyDefault = async (objselectedTax) => {
    const jsonData = {
      PropertyCode: selectedProperty,
      ConfigType: "purchasetaxtosend",
      PromisLedgerName: "purchasetaxtosend",
      TallyLedgerName: isCheckedSendTaxDetails ? "1" : "0",
      TallyHead: "Sundry Creditors",
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
          body: JSON.stringify(
            jsonData
            // Include any data you need to send in the body
          ),
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
      setTaxOptions([]);
    } finally {
      //setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false)
    
    if (selectedOrganization == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Organization Name')
      return;
    }
    if (selectedProperty == "") {
      setenableErrorTextFlag(true);
      setErrorText("Must Select the Property Name");
      return;
    }

    if (selectedTransferType == "") {
      setenableErrorTextFlag(true);
      setErrorText("Must Select the Transfer Type");
      return;
    }

    const jsonData = {
      PropertyCode: selectedProperty,
      ConfigType: "inventorytransfertype",
      PromisLedgerName: "inventorytransfertype",
      TallyLedgerName: selectedTransferType,
      TallyHead: "Sundry Creditors",
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

      await saveCheckTaxDetailsbyDefault();
    } catch (error) {
      // console.error("Error fetching options:", error);
    } finally {
      //setLoading(false);
    }
  };

  return (
    <div className="MainContentSettings">
      <div className="container mt-3">
        <form className="FormDiv" onSubmit={handleSubmit}>
          <h5>General Settings</h5>
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
                <option key={option.propertyCode} value={option.propertyCode}>
                  {option.propertyName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="second-dropdown" className="form-label">
              Transfer Type:
            </label>
            <select
              id="second-dropdown"
              className="form-select"
              value={selectedTransferType}
              onChange={handleTransferTypeDropdownChange}
            >
              <option key="-1" value="">
                Select the Transfer Type
              </option>
              {SettingsOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.optionValue}
                </option>
              ))}
            </select>
          </div>
          <div className="form-check">
            {selectedTransferType == "1" ? (
              <input
                className="form-check-input"
                type="checkbox"
                checked={isCheckedSendTaxDetails}
                onChange={handleCheckboxChange}
              />
            ) : (
              <input
                className="form-check-input"
                type="checkbox"
                checked={isCheckedSendTaxDetails}
                onChange={handleCheckboxChange}
                disabled
              />
            )}
            <label className="form-check-label">
              Send Tax Details by Default
            </label>
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

export default MasterConfigSettings;
