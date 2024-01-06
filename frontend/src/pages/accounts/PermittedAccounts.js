import React, { useEffect, useState } from "react";
import styles from "../../styles/PermittedAccounts.module.css";
import { Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";

const PermittedAccounts = () => {
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
    <Container className={styles.PermittedAccounts}>
      {permittedAccounts.results.length ? (
        <>
          <p>Permitted users</p>
          {permittedAccounts.results.map((account) => (
            <p key={account.id}>{account.owner}</p>
          ))}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PermittedAccounts;
