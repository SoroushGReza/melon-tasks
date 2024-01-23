import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";

// Contexts to manage current user data
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks for using contexts
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Provide current user context to its children
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  // Function to fetch current user details
  const handleMount = useCallback(async () => {
    try {
      const { data } = await axiosRes.get(`/dj-rest-auth/user/`);
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Hook to execute handleMount on component mount
  useEffect(() => {
    handleMount();
  }, [handleMount]);

  // Memo hook to set up interceptors for HTTP requests and responses
  useMemo(() => {
    // Interceptor for requests to handle token refresh
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axios.post(`/dj-rest-auth/token/refresh/`);
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

    // Interceptor for responses to handle unauthorized access
    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post(`/dj-rest-auth/token/refresh/`);
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

  // Providing the current user data and the function to update it
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
