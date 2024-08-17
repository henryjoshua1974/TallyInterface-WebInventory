import React, { useState, useEffect, useContext } from "react";
import MyContext from "../Context/ContextDetails";
import TallyHead from "./TallyHead";
import "./MasterConfigTaxStructure.css";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../config/config.jsx";

const MasterConfigTaxStructure = () => {
  const { publicKey } = useContext(MyContext);
  const { publicOrganization } = useContext(MyContext);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedTaxStructure, setSelectedTaxStructure] = useState("");
  const [selectedTallyHead, setSelectedTallyHead] = useState("");
  const [PropertyOptions, setPropertyOptions] = useState([]);
  const [TaxStructureOptions, setTaxStructureOptions] = useState([]);
  const [LedgerName, setLedgerName] = useState("");
  const [enableErrorTextFlag, setenableErrorTextFlag] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [enableSuccessTextFlag, setenableSuccessTextFlag] = useState(false);

  const apiurl =
    config.apiUrl.charAt(config.apiUrl.length - 1) != "/"
      ? config.apiUrl + "/"
      : "";

  const handleTaxStructureDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedTallyHead("");
    setSelectedTaxStructure(selectedValue);

    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false);

    if (selectedValue == "") {
      return;
    }
    const jsonData = {
      PropertyCode: selectedProperty,
      ConfigType: "taxstructure",
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
          setSelectedTallyHead(
            data.tallyInterfaceInventoryMasterViewDetailsResponse[0].tallyHead
          );
        }
      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
        //setLoading(false);
      }
    } else {
      setTaxStructureOptions([]); // Clear options if no valid selection
    }
  };


  const handlePropertyDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedTallyHead("");
    setSelectedProperty(selectedValue);
    setLedgerName('');
    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false);


    const jsonData = {
      PropertyCode: selectedValue,
    };

    if (selectedValue) {
      try {
        const response = await fetch(
          apiurl + "TallyInterfaceInventoryTaxStructureMaster",
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
        

        setTaxStructureOptions(data.tallyInterfaceInventoryTaxStructureMasterDetails);

      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
        //setLoading(false);
      }
    } else {
      setTaxStructureOptions([]); // Clear options if no valid selection
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
    setenableSuccessTextFlag(false);

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
      setTaxStructureOptions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setenableErrorTextFlag(false);
    setenableSuccessTextFlag(false);

    if (selectedOrganization == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Organization Name')
      return;
    }

    if (selectedProperty == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Property Name')
      return;
    }

    if (selectedTaxStructure == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Tax Structure Name')
      return;
    }

    if (LedgerName == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Enter the Ledger Name')
      return;
    }

    const jsonData = {
      PropertyCode: selectedProperty,
      ConfigType: "taxstructure",
      PromisLedgerName: selectedTaxStructure,
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
    <div className="MainContentTaxStructure">
      <div className="container mt-3">
        <form className="FormDiv" onSubmit={handleSubmit}>
          <h5>Tax Structure Configuration</h5>
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
              TaxStructure:
            </label>
            <select
              id="second-dropdown"
              className="form-select"
              onChange={handleTaxStructureDropdownChange}
            ><option key="-1" value="">Select the TaxStructure</option>
              {TaxStructureOptions.map((option) => (
                <option key={option.taxStructureName} value={option.taxStructureName}>
                  {option.taxStructureName}
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
          
          {enableErrorTextFlag && <label className={(enableSuccessTextFlag)?"SuccessTextClass":"ErrorTextClass"}>{errorText}</label>}
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

export default MasterConfigTaxStructure;