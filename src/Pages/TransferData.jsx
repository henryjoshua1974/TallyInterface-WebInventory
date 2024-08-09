import React, { useState, useContext, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MyContext from '../Context/ContextDetails';
import config from '../config/config.jsx';
import './TransferData.css'
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function TransferData() {
  const { publicKey } = useContext(MyContext);
  const { publicOrganization } = useContext(MyContext);

  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());

  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [PropertyOptions, setPropertyOptions] = useState([]);
  const apiurl = (config.apiUrl.charAt(config.apiUrl.length - 1) != '/' ? config.apiUrl + '/' : '');
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [execTransferDataFlag, setExecTransferDataFlag] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showMessageTextFlag, setShowMessageTextFlag] = useState(false);
  const navigate = useNavigate();

  const handleExpiry = () => {
    if (publicKey == '' || publicOrganization == '')
      navigate(`/`);

  }

  useEffect(() => {
    handleExpiry();
  }, [publicKey]); // Only re-run the effect if count changes



  // Handle change event
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;
    
    if (isChecked) {
      setSelectedProperty((prev) => [...prev, value]);
    } else {
      setSelectedProperty((prev) => prev.filter((item) => item !== value));
    }
  };


  const selectedPropertyString = selectedProperty.join(',');


  const handleOrganizationDropdownChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOrganization(selectedValue);
    setPropertyOptions([]);

    if (selectedValue) {
      try {

        const response = await fetch(
          apiurl + 'TallyInterfaceInventoryPropertyMaster', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'PublicKey': publicKey,
            'OrganizationId': selectedValue
          },

        });

        const data = await response.json();

        setPropertyOptions(data.tallyInterfaceInventoryPropertyMasterDetails);



      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
      }
    } else {
      setCategoryOptions([]); // Clear options if no valid selection
    }
  };


  function getNoofDaysBetweenDays() {
    const timeDiff = selectedToDate.getTime() - selectedFromDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return (dayDiff);

  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    setExecTransferDataFlag(false);
    setShowMessageTextFlag(false);

    if (selectedProperty==''){
      setExecTransferDataFlag(true);
      setErrorText('Must Select the Property')
      return;
    }


    const NoofDays = getNoofDaysBetweenDays();

   
    if (NoofDays < 0) {
      setExecTransferDataFlag(true);
      setErrorText('The To Date must be After or Equal to the From Date')
      return;
    }


    if (NoofDays > 14) {
      setExecTransferDataFlag(true);
      setErrorText('Cannot Transfer More than 15 Days')
      return;
    }

    if (selectedPropertyString.includes(',') && NoofDays > 6) {
      setExecTransferDataFlag(true);
      setErrorText('Cannot Transfer More than 7 Days')
      return;
    }
    
    
    let xmlFileName ='TallyTransferInventory.xml';
    if (!selectedPropertyString.includes(','))  {

      if (PropertyOptions.length>0){
        PropertyOptions.forEach(item => {
          if (item.propertyCode==selectedProperty){
            xmlFileName = 'TallyTransferInventory'+item.propertyName.replace(/\s+/g, '')+'.xml'
          }
        });
      }
    }

    const jsonData = {
      PropertyCode: selectedPropertyString,
      FromDate: formatDate(selectedFromDate),
      ToDate: formatDate(selectedToDate),
    };

    try {


      const response = await fetch(
        apiurl + 'TallyInterfaceInventoryTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PublicKey': publicKey,
          'OrganizationId': selectedOrganization
        },
        body: JSON.stringify(jsonData
        )
      });

      const data = await response.json();

      downloadJSON(data.xmlOutput,xmlFileName)
      if (data.dataMismatchError!=''){
        alert(data.dataMismatchError)  
      }
      else{
        setShowMessageTextFlag(true);
        setMessageText(
        "Tally Import File " + xmlFileName + " Downloaded Successfully");  
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      //setLoading(false);
    }

  };
  const downloadJSON = (data,xmlFileName) => {
    const blob = new Blob([data], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = xmlFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const formatDate = (date) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };


  return (

    <div className='MainContentTransferData'>
      <div className="container mt-3">
        <form className="FormDiv" onSubmit={handleSubmit}>

          <h5>Transfer Data</h5>
          <br />
          <div className="mb-3">

            <label htmlFor="dropdownOrganization" className="form-label">Organization</label>
            <select id="dropdownOrganization" className="form-select" onChange={handleOrganizationDropdownChange}>
              <option value="" >Select the Organization</option>
              {publicOrganization.map((option) => (
                <option key={option.organizationId} value={option.organizationId}>{option.organizationName}</option>
              ))}
            </select>
          </div>


          <div className="mb-3">
            <label className="form-label">Select Property</label>
            <div className='classlistbox'>
              {PropertyOptions.map((item) => (
                <div key={item.propertyCode}>
                  <label>
                    <input
                      type="checkbox"
                      value={item.propertyCode}
                      checked={selectedProperty.includes(item.propertyCode)}
                      onChange={handleCheckboxChange}
                    />
                    &nbsp;{item.propertyName}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className='clsdtp'>
            <div className="clsdtpsub">

              <label className="form-label">From Date</label>
              <br />

              <DatePicker
                selected={selectedFromDate}
                onChange={(date) => setSelectedFromDate(date)}
                dateFormat="dd-MMM-yyyy"
              />

            </div>

            <div className="clsdtpsub">

              <label className="form-label">To Date</label>
              <br />

              <DatePicker
                selected={selectedToDate}
                onChange={(date) => setSelectedToDate(date)}
                dateFormat="dd-MMM-yyyy"
              />

            </div>
          </div>
          <br />
          <button className="btn btn-primary" type="submit">Transfer Data</button>
          <br />
          <br />
          
          {execTransferDataFlag && <label className="ErrorTextClass">{errorText}</label>}
          {showMessageTextFlag && <label className="MessageTextClass">{messageText}</label>}
        </form>
      </div>
    </div>


  )
}

export default TransferData
