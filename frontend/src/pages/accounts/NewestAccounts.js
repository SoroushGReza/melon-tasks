import React, { useState, useEffect } from "react";
import styles from "../../styles/NewestAccounts.module.css";
import { Container, Col, Row } from "react-bootstrap";
import { useAccountData } from "../../contexts/AccountDataContext";
import Asset from "../../components/Asset";
import Account from "./Account";

const NewestAccounts = ({ mobile }) => {
  const { newestAccounts } = useAccountData();
  const [displayedAccounts, setDisplayedAccounts] = useState([]);

  useEffect(() => {
    if (newestAccounts.results) {
      // Sort by created_at in descending order
      const sortedAccounts = [...newestAccounts.results].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Determine nr of accounts to display based on screen size
      const numAccountsToShow = mobile ? 3 : 5;
      setDisplayedAccounts(sortedAccounts.slice(0, numAccountsToShow));
    }
  }, [newestAccounts, mobile]);

  // Adjusted column sizes for different screen sizes
  const columnSize = mobile ? 4 : 12;

  return (
    <Container
      className={`${styles.NewestAccounts} ${
        mobile ? "d-lg-none text-center mb-3" : ""
      }`}
    >
      {displayedAccounts.length ? (
        <>
          <p className={styles.NewestUsersP}>Newest Users</p>
          <Row className={`${mobile ? styles.NewestAccountsMobile : ""}`}>
            {displayedAccounts.map((account) => (
              <Col key={account.id} xs={columnSize} className="mb-3">
                <Account account={account} mobile={mobile} />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default NewestAccounts;
