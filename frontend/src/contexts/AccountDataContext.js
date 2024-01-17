import React, { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";

export const AccountDataContext = createContext();
export const SetAccountDataContext = createContext();

// Custom hooks
export const useAccountData = () => useContext(AccountDataContext);
export const useSetAccountData = () => useContext(SetAccountDataContext);

export const AccountDataProvider = ({ children }) => {
  const [accountData, setAccountData] = useState({
    pageAccount: { results: [] },
    newestAccounts: { results: [] },
  });

  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/accounts/?ordering=-created_at");
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

  return (
    <AccountDataContext.Provider value={accountData}>
      <SetAccountDataContext.Provider value={setAccountData}>
        {children}
      </SetAccountDataContext.Provider>
    </AccountDataContext.Provider>
  );
};
