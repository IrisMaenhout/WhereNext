import React, { useContext, useEffect } from 'react';
import { LoggedInUserContext } from '../../context/LoggedInUserContext';

function Login({setLogin}) {

    // const { loggedInUserData, setLoggedInUserData, error, setError } = useContext(LoggedInUserContext);


    // console.log(loggedInUserData);
    // useEffect(()=>{
    //     fetch(`${process.env.REACT_APP_BASE_URL_API}/users/login`)
    //     .then(res => res.json())
    //     .then(data => console.log())
    // }, []);

    const loginFunc = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: "nicole@gmail.com",
	            password: "test"
            }),
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          // setLoggedInUserData(data);
          // sessionStorage.setItem('loggedInUser', JSON.stringify(data));
        //   console(loggedInUserData);
          setLogin(data);
        //   setPlaces(data.places || []);
      } catch (error) {
        // setError(error.message);
      }
    };
    
      // useEffect(() => {
      //   loginFunc();
      // }, []);


      function handleClick(){
        loginFunc();
      }

    return (
        <div>
            <h1>Login</h1>

            <button onClick={handleClick}>Login</button>
        </div>
    );
}

export default Login;