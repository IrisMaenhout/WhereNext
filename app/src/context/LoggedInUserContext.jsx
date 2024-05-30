// import React, { createContext, useState } from 'react';

// // Create the context
// export const LoggedInUserContext = createContext();

// // Create a provider component
// export const LoggedInUserProvider = ({ children }) => {
//     const [loggedInUserData, setLoggedInUserData] = useState({});
//     const [error, setError] = useState(null);

//     return (
//         <LoggedInUserContext.Provider value={{ loggedInUserData, setLoggedInUserData, error, setError }}>
//             {children}
//         </LoggedInUserContext.Provider>
//     );
// };


import React, { createContext, useContext } from 'react';

export const LoggedInUserContext = createContext(null);

export const LoggedInUserProvider = ({ value, children }) => {
  return (
    <LoggedInUserContext.Provider value={value}>
      {children}
    </LoggedInUserContext.Provider>
  );
};

