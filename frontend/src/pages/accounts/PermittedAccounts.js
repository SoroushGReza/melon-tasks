import React, { useEffect, useState } from "react";
import styles from "../../styles/PermittedAccounts.module.css";
import { Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";
import Account from "./Account";

const PermittedAccounts = ({ mobile }) => {
  const [accountData, setAccountData] = useState({
    pageAccount: { results: [] },
    permittedAccounts: { results: [] },
  });
  const { permittedAccounts } = accountData;
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/accounts/?ordering=-permit_users"
        );
        setAccountData((prevState) => ({
          ...prevState,
          permittedAccounts: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <Container
      className={`${styles.PermittedAccounts} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {permittedAccounts.results.length ? (
        <>
          <p>Permitted users</p>
          {mobile ? (
            <div
              className={`${styles.PermittedMobile} d-flex justify-content-center`}
            >
              {permittedAccounts.results.slice(0, 4).map((account) => (
                <Account key={account.id} account={account} mobile />
              ))}
            </div>
          ) : (
            permittedAccounts.results.map((account) => (
              <Account key={account.id} account={account} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PermittedAccounts;
