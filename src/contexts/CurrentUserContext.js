import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// every time we call the createContext function, a new Context Object is created
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);  // current user state

    const handleMount = async () => {
      try {
        // make a GET request to the user endpoint. Destructure the data property in place and set the currentUser to data
        const { data } = await axios.get("dj-rest-auth/user/");  // make a request when the component mounts
        setCurrentUser(data);
      } catch (err) {
        console.log(err);
      }
    };
  
    // to have code run when a component mounts,  e have to make use of the useEffect hook and pass it an empty dependency array
    useEffect(() => {
      handleMount();
    }, []);

    return (
    // these two Context Object Providers will allow both the currentUser value and the function to update it, 
    // to be available to every child component in our application
    <CurrentUserContext.Provider value={currentUser}>
    <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
    </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
    )
}