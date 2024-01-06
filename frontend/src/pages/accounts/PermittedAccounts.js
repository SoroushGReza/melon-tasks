import React from "react";
import styles from "../../styles/PermittedAccounts.module.css";
import { Container } from "react-bootstrap";
import { useAccountData } from "../../contexts/AccountDataContext";
import Asset from "../../components/Asset";
import Account from "./Account";

const PermittedAccounts = ({ mobile }) => {
  const { permittedAccounts } = useAccountData();

  return (
    <Container
      className={`${styles.PermittedAccounts} ${
        mobile ? "d-lg-none text-center mb-3" : ""
      }`}
    >
      {permittedAccounts.results.length ? (
        <>
          <p>Permitted users</p>
          <div className={`${mobile ? styles.PermittedMobile : ""}`}>
            {permittedAccounts.results.map((account) => (
              <div
                key={account.id}
                className={mobile ? "d-flex justify-content-center" : ""}
              >
                <Account account={account} mobile={mobile} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PermittedAccounts;
