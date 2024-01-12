import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");

        // If user is logged in, code below will run
        if (userAuthStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // If user is NOT logged in, code below will run
        if (userAuthStatus === "loggedOut") {
          history.push("/signin");
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus]);
};
