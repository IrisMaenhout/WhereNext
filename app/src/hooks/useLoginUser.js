import { useState } from 'react';

export default function useLoggedInUser() {
  const getUser = () => {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    if (!loggedInUserString) return null;
    const loggedInUserObj = JSON.parse(loggedInUserString);
    return loggedInUserObj;
  };

  const [loggedInUser, setLoggedInUser] = useState(getUser());

  const saveUser = loggedInUserObj => {
    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUserObj));
    setLoggedInUser(loggedInUserObj);
  };


  return {
    setLoggedInUser: saveUser,
    loggedInUser
  };
}
