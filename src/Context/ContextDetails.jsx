import React, { createContext, useState } from 'react'

const MyContext = createContext();

export const MyContextProvider=({ children }) =>{
    const [publicKey, setPublicKey] = useState('');
    const [publicOrganization, setPublicOrganization] = useState([]);
    const [publicLoginName, setPublicLoginName] = useState([]);

    const assignLoginName = (ploginName) => {
        setPublicLoginName(ploginName);
    }


    const assignPublicKey = (pkey) => {
        setPublicKey(pkey);
    }

    const assignPublicOrganization = (porg) => {
        setPublicOrganization(porg);

    }



    return (

        <MyContext.Provider value={{ publicKey, assignPublicKey,publicOrganization,assignPublicOrganization,publicLoginName,assignLoginName }}>
            {children}
        </MyContext.Provider>

    )
};

export default MyContext;


