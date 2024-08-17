import React, { useState, useEffect, useContext } from "react";
import MyContext from "../Context/ContextDetails";
import TallyHead from "./TallyHead";
import "./MasterConfigTax.css";
import "bootstrap/dist/css/bootstrap.min.css";
import config from "../config/config.jsx";
import editimg from "../assets/icons-edit.png";
import deleteimg from "../assets/icons-delete.png";
import editfinalimg from "../assets/icons-edit-final.png";

const MasterConfigTax = () => {
  const { publicKey } = useContext(MyContext);
  const { publicOrganization } = useContext(MyContext);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedTax, setSelectedTax] = useState("");
  const [selectedTallyHead, setSelectedTallyHead] = useState("");
  const [PropertyOptions, setPropertyOptions] = useState([]);
  const [TaxOptions, setTaxOptions] = useState([]);
  const [LedgerName, setLedgerName] = useState("");
  const [enableErrorTextFlag, setenableErrorTextFlag] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [newRow, setNewRow] = useState({
    percentage: "",
    tallyLedgerName: "",
    tallyHead: "",
  });
  const [editIdx, setEditIdx] = useState(-1);

  const [rows, setRows] = useState([]);

  const apiurl =
    config.apiUrl.charAt(config.apiUrl.length - 1) != "/"
      ? config.apiUrl + "/"
      : "";

  const handleChangePercentage = (e, column, index = null) => {
    const filteredValue = e.target.value
      .replace(/[^0-9.]/g, "") // Remove everything except digits and decimal point
      .replace(/(\..*)\./g, "$1"); // Ensure only one decimal point

    setenableErrorTextFlag(false);
    const num = Number(filteredValue);
    if (num < 0 || num > 100) {
      setenableErrorTextFlag(true);
      setErrorText("Tax Percentage must be between 0 and 100");
      return;
    }

    if (index === null) {
      setNewRow({ ...newRow, [column]: filteredValue });
    } else {
      const newRows = rows.map((row, idx) =>
        idx === index ? { ...row, [column]: filteredValue } : row
      );
      setRows(newRows);
    }
  };

  const handleChangeOthers = (e, column, index = null) => {
    const textValue = e.target.value;

    if (index === null) {
      setNewRow({ ...newRow, [column]: textValue });
    } else {
      const newRows = rows.map((row, idx) =>
        idx === index ? { ...row, [column]: textValue } : row
      );
      setRows(newRows);
    }
  };

  const handleDelete = (index) => {
    const editFinalRow = rows[index];

    handleSaveToAPI(
      '',
      editFinalRow.tallyHead,
      editFinalRow.percentage
    ); 
    //   const newRows = rows.filter((row, idx) => idx !== index);
    // setRows(newRows);
  };

  const handleEdit = (index) => {
    setEditIdx(index);
  };

  const handleSave = (index) => {
    const editFinalRow = rows[index];
    setEditIdx(-1);
    handleSaveToAPI(
      editFinalRow.tallyLedgerName,
      editFinalRow.tallyHead,
      editFinalRow.percentage
    );
  };

  const handleInsert = async () => {
    setenableErrorTextFlag(false);

    if (selectedOrganization == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Organization Name')
      return;
    }

    if (selectedProperty == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Property')
      return;
    }

    if (selectedTax == '') {
      setenableErrorTextFlag(true);
      setErrorText('Must Select the Tax')
      return;
    }


    if (newRow.percentage == "") {
      setenableErrorTextFlag(true);
      setErrorText("Percentage is required");
      return;
    }
    if (newRow.tallyLedgerName == "") {
      setenableErrorTextFlag(true);
      setErrorText("Tally Ledger is required");
      return;
    }

    if (newRow.tallyHead == "") {
      setenableErrorTextFlag(true);
      setErrorText("Tally Head is required");
      return;
    }

    handleSaveToAPI(
      newRow.tallyLedgerName,
      newRow.tallyHead,
      newRow.percentage
    );
  };

  const handleSaveToAPI = async (
    objTallyLedgerName,
    objTallyHead,
    objPercentage
  ) => {
    const jsonData = {
      PropertyCode: selectedProperty,
      ConfigType: "tax",
      PromisLedgerName: selectedTax,
      TallyLedgerName: objTallyLedgerName,
      TallyHead: objTallyHead,
      Percentage: parseFloat(objPercentage),
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
      setNewRow({ percentage: "", tallyLedgerName: "", tallyHead: "" });

      await LoadDataTax(selectedTax);

      // setRows(data.tallyInterfaceInventoryMasterViewDetailsResponse);
    } catch (error) {
      // console.error("Error fetching options:", error);
    } finally {
      //setLoading(false);
    }
  };

  // useEffect(() => {
  const LoadDataTax = async (objselectedTax) => {
    const jsonData = {
      PropertyCode: selectedProperty,
      ConfigType: "tax",
      PromisLedgerName: objselectedTax,
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

      setRows(data.tallyInterfaceInventoryMasterViewDetailsResponse);
    } catch (error) {
      // console.error("Error fetching options:", error);
      setTaxOptions([]);
    } finally {
      //setLoading(false);
    }
  };

  const handleTaxDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setenableErrorTextFlag(false);
    newRow.percentage='';
    newRow.tallyLedgerName = '';
    newRow.tallyHead='';

    setSelectedTallyHead("");
    setSelectedTax(selectedValue);

    if (selectedValue == "") {
      return;
    }
    await LoadDataTax(selectedValue);
    // setLoadTaxDetails(true);
  };

  const handlePropertyDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setRows([]);
    setSelectedTax('');
    setSelectedTallyHead("");
    setSelectedProperty(selectedValue);

    setenableErrorTextFlag(false);
 
    const jsonData = {
      PropertyCode: selectedValue,
    };


    if (selectedValue) {
      try {
        const response = await fetch(
          apiurl + "TallyInterfaceInventoryTaxCodeMaster",
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

        setTaxOptions(data.tallyInterfaceInventoryTaxCodeMasterDetails);
      } catch (error) {
        // console.error("Error fetching options:", error);
      } finally {
        //setLoading(false);
      }
    } else {
      setTaxOptions([]); // Clear options if no valid selection
    }
  };

  const handleOrganizationDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setRows([]);
    setSelectedTax('');
    setSelectedTallyHead("");
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
      setTaxOptions([]);
    }
  };

  return (
    <div className="MainContentTax">
      <div className="container mt-3">
        <div className="FormDiv">
          <h5>Tax Configuration</h5>
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
              Tax Code:
            </label>
            <select
              id="second-dropdown"
              className="form-select"
              onChange={handleTaxDropdownChange}
            >
              <option key="-1" value="">
                Select the Tax
              </option>
              {TaxOptions.map((option) => (
                <option key={option.taxCodeName} value={option.taxCodeName}>
                  {option.taxCodeName}
                </option>
              ))}
            </select>
          </div>
          {/* *********************Table *********************** */}
          <br />
          {/* <div className="container mt-5"> */}
          <table className="custom-table">
            <thead>
              <tr>
                <th className="percentcolumn">Percentage</th>
                <th>Tally Ledger</th>
                <th>Tally Head</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    {row.percentage}
                    {/* {editIdx === index ? (
                      <input
                        type="text"
                        value={row.percentage}
                        onChange={(e) =>
                          handleChangePercentage(e, "percentage", index)
                        }
                      />
                    ) : (
                      row.percentage
                    )} */}
                  </td>
                  <td>
                    {editIdx === index ? (
                      <input
                        type="text"
                        value={row.tallyLedgerName}
                        onChange={(e) =>
                          handleChangeOthers(e, "tallyLedgerName", index)
                        }
                      />
                    ) : (
                      row.tallyLedgerName
                    )}
                  </td>
                  <td>
                    {editIdx === index ? (
                      <select
                        value={row.tallyHead}
                        onChange={(e) =>
                          handleChangeOthers(e, "tallyHead", index)
                        }
                        className="form-select"
                      >
                        {TallyHead.map((option) => (
                          <option key={option.name} value={option.name}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      row.tallyHead
                    )}
                  </td>
                  <td>
                    {editIdx === index ? (
                      // <button className="btn btn-success" onClick={handleSave}>
                      //   Save
                      // </button>
                      <img
                        src={editfinalimg}
                        alt=""
                        className="imgClass"
                        onClick={() => handleSave(index)}
                      />
                    ) : (
                      // <button className="btn btn-primary" onClick={() => handleEdit(index)}>
                      //     Edit
                      //     </button>
                      <>
                        <img
                          src={editimg}
                          alt=""
                          className="imgClass"
                          onClick={() => handleEdit(index)}
                        />
                      </>
                    )}
                    {/* <button className="btn btn-danger" onClick={() => handleDelete(index)}>
                  Delete
                </button> */}
                    <>
                      &nbsp;&nbsp;
                      <img
                        src={deleteimg}
                        alt=""
                        className="imgClass"
                        onClick={() => handleDelete(index)}
                      />
                    </>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <input
                    type="text"
                    value={newRow.percentage}
                    onChange={(e) => handleChangePercentage(e, "percentage")}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newRow.tallyLedgerName}
                    onChange={(e) => handleChangeOthers(e, "tallyLedgerName")}
                    className="form-control"
                  />
                </td>
                <td>
                  <select
                    value={newRow.tallyHead}
                    onChange={(e) => handleChangeOthers(e, "tallyHead")}
                    className="form-select"
                  >
                    <option key="-1" value="">
                      Select the Tally Head
                    </option>
                    {TallyHead.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleInsert}
                  >
                    Add
                  </button>
                  {/* <img src={addimg} alt="" className="imgInsertClass" onClick={handleInsert} /> */}
                </td>
              </tr>
            </tbody>
          </table>
          {/* </div> */}
          <br />
          {/* <button className="btn btn-primary" type="submit">
            Submit
          </button> */}
          {/* <br /> */}
          {enableErrorTextFlag && (
            <label className="ErrorTextClass">{errorText}</label>
          )}
          <br />

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default MasterConfigTax;
