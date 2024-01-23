import React, { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";

// Context to share account data through components
export const AccountDataContext = createContext();
export const SetAccountDataContext = createContext();

// Custom hooks for easy access to context
export const useAccountData = () => useContext(AccountDataContext);
export const useSetAccountData = () => useContext(SetAccountDataContext);

// Wrap children components and provide them with account data
export const AccountDataProvider = ({ children }) => {
  const [accountData, setAccountData] = useState({
    pageAccount: { results: [] },
    newestAccounts: { results: [] },
  });

  // Access current user data
  const currentUser = useCurrentUser();

  // Fetch and set account data when component mounts or currentUser changes
  useEffect(() => {
    const handleMount = async () => {
      try {
        // Fetching newest account data
        const { data } = await axiosReq.get("/accounts/?ordering=-created_at");
        // Updating state with fetched data
        setAccountData((prevState) => ({
          ...prevState,
          newestAccounts: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [currentUser]);

  // Provide accountData and setAccountData to children component
  return (
    <AccountDataContext.Provider value={accountData}>
      <SetAccountDataContext.Provider value={setAccountData}>
        {children}
      </SetAccountDataContext.Provider>
    </AccountDataContext.Provider>
  );
};
