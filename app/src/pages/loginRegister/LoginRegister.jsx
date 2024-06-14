import React, { useContext, useEffect, useState } from 'react';
import styles from './loginRegister.module.css';
import InputWithLabel from '../../components/global/formInputs/input/inputWithLabel/inputWithLabel';
import PasswordInputWithLabel from '../../components/global/formInputs/input/passwordInputWithLabel/PasswordWithLabel';
import PrimaryBtn from '../../components/global/btns/primary/btn/PrimaryBtn';

function LoginRegister({setLogin, isLogin}) {

    const [isLoginPage, setIsLoginPage] = useState(isLogin);
    const [formData, setFormData] = useState( isLoginPage ? {
        email: "",
        password: ""
    } : {
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    });

    const [errors, setErrors ] = useState();
    

    
    function updateFormData(event) {
      const {name, value} = event.target
      setFormData(prevFormData => {
          return {
              ...prevFormData,
              [name]: value
          }
      })
    }

    const loginFunc = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
	              password: formData.password
            }),
          });

          const data = await response.json();
    
          if (!response.ok) {
            setErrors(data.error);
          }
    
          setLogin(data);
      } catch (error) {
        return;
      }
    };

    const registerFunc = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/users/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }),
          });
    
          const data = await response.json();

          if (!response.ok) {
            setErrors(data.error);
            // throw new Error('Network response was not ok');
          }
    
          setLogin(data);
  
      } catch (error) {
        return;
      }
    };


      function handleSubmit(e){
        e.preventDefault();
        if(isLoginPage){
          loginFunc();
        }else{
          registerFunc();
        }
        
      }

    return (
        <div>
             <div className={styles.authContainer}>
              <div className={styles.authorizationCard}>
      

                  <form className={styles.cardContent} onSubmit={handleSubmit}>
                      <h2 className={styles.title}>{isLoginPage ? 'Sign in' : 'sign up'}</h2>

                      {
                          errors && 
                          errors.map((err, i)=> (
                              <p key={i} className={styles.errorMessage}>{err}</p>
                          ))  
                      }

                      {
                        !isLoginPage && 
                        <>
                          <InputWithLabel name={"firstname"} labelText={"First name"} inputType={"text"} value={formData.firstname} handleChange={updateFormData}/>

                          <InputWithLabel name={"lastname"} labelText={"Last name"} inputType={"text"} value={formData.lastname} handleChange={updateFormData}/>
                        
                        </>
                      }

                      <InputWithLabel name={"email"} labelText={"E-mail"} inputType={"email"} value={formData.email} handleChange={updateFormData}/>
                      
                      <PasswordInputWithLabel name={"password"} labelText={"Wachtwoord"} value={formData.password} handleChange={updateFormData}/>
                      

                      <PrimaryBtn style={styles.submitBtn}>
                          Sign in
                      </PrimaryBtn>

                      <div className={styles.toOtherPage}>
                          {
                            isLoginPage ?
                            <>
                              <span>No account yet?</span><p onClick={() => setIsLoginPage(false)}>Create one here</p>
                            </>
                            :
                            <>
                              <span>Do you already have an account?</span><p onClick={() => setIsLoginPage(true)}>Sign in here</p>
                            </>
                          }
                          
                      </div>
                          
                  </form>

                  {/* image */}
                  {/* <div className=""> */}
                      <img src="https://images.unsplash.com/photo-1548957175-84f0f9af659e?q=80&w=1782&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="house" className={styles.sideImage}/>
                  {/* </div> */}

                  
              </div>
          </div>
        </div>
    );
}

export default LoginRegister;