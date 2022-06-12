import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";

// every time we call the createContext function, a new Context Object is created
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

export const CurrentUserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);  // current user state
    const history = useHistory();

    const handleMount = async () => {
      try {
        // make a GET request to the user endpoint. Destructure the data property in place and set the currentUser to data
        const { data } = await axiosRes.get("dj-rest-auth/user/");  // make a request when the component mounts
        setCurrentUser(data);
      } catch (err) {

      }
    };
  
    // to have code run when a component mounts,  e have to make use of the useEffect hook and pass it an empty dependency array
    useEffect(() => {
      handleMount();
    }, []);

    // useMemo runs before the children components are mounted
    // And we want to attach the interceptors  before the children mount, as that’s where we’ll be using them and making the requests from
    useMemo(() => {
      // set axiosReq to always refresh access token before making a request
      axiosReq.interceptors.request.use(
        async (config) => {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
            return config;
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );

      //  configur our response interceptor to listen for 401 errors in the responses from our API, 
      // and attempt to refresh the access token when needed and respond accordingly
      axiosRes.interceptors.response.use(
        (response) => response,
        async (err) => {
          if (err.response?.status === 401) {
            try {
              await axios.post("/dj-rest-auth/token/refresh/");
            } catch (err) {
              setCurrentUser((prevCurrentUser) => {
                if (prevCurrentUser) {
                  history.push("/signin");
                }
                return null;
              });
            }
            return axios(err.config);
          }
          return Promise.reject(err);
        }
      );
    }, [history]);

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