import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");
        // No redirection when logged in
      } catch (err) {
        if (userAuthStatus === "loggedOut") {
          // Redirect to signin only if the user is on a page that requires authentication
          if (
            location.pathname !== "/signin" &&
            location.pathname !== "/signup"
          ) {
            history.push("/signin");
          }
        }
      }
    };

    handleMount();
  }, [history, location, userAuthStatus]);
};
