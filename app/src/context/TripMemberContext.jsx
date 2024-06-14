import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound404 from "../pages/404/NotFound404";
import { LoggedInUserContext } from "./LoggedInUserContext";


const TripMemberContainer = ({children}) => {
    const { tripId } = useParams();
    const loggedInUser = useContext(LoggedInUserContext);
    const [isUnauthorized, setIsUnauthorized] = useState();

    const getTripData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/trips/${tripId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': loggedInUser._id
                }
            });
  
            if (!response.ok || response.status === 404) {
                return;
            }
  
            const data = await response.json();
  
            const searchUser = data.members.find((member) => member._id === loggedInUser._id);
            setIsUnauthorized(searchUser === undefined ? true : false);
  
  
        } catch (error) {
            console.error(error);
        }
    };
  
    useEffect(()=>{
      if(tripId){
        getTripData();
      }
    }, [tripId]);

 
  if (!isUnauthorized) {
    return <>{children}</>
  }else{
    return <NotFound404 />;
  }
  
};

export default TripMemberContainer;