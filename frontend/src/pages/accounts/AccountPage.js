import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/AccountPage.module.css";
import appStyles from "../../App.module.css";
import { AccountEditDropdown } from "../../components/MoreDropdown.js";

import Task from "../tasks/Task.js";
import { fetchMoreData } from "../../utils/utils.js";
import NoResults from "../../assets/no-results.png";

import NewestAccounts from "./NewestAccounts";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useAccountData,
  useSetAccountData,
} from "../../contexts/AccountDataContext";
import { Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

function formatOwnerName(ownerName) {
  if (!ownerName) return "";
  return ownerName.toLowerCase().charAt(0).toUpperCase() + ownerName.slice(1);
}

function AccountPage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [accountTasks, setAccountTasks] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const setAccountData = useSetAccountData();
  const { pageAccount } = useAccountData();
  const [account] = pageAccount.results;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the account details of the visited account
        const { data: visitedAccount } = await axiosReq.get(`/accounts/${id}/`);

        // Add the tasks URL to fetch tasks of the visited account
        let tasksUrl = `/tasks/?owner__username=${visitedAccount.owner}`;

        // If the current user is not owner of account visited -
        // only public tasks are fetched
        if (currentUser?.username !== visitedAccount.owner) {
          tasksUrl += "&is_public=true";
        }

        // Fetch the tasks based on the construct URL
        const { data: accountTasks } = await axiosReq.get(tasksUrl);

        // Update state with the fetched data
        setAccountData((prevState) => ({
          ...prevState,
          pageAccount: { results: [visitedAccount] },
        }));
        setAccountTasks(accountTasks);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id, setAccountData, currentUser]);

  const mainAccount = (
    <>
      {account?.is_owner && <AccountEditDropdown id={account?.id} />}
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.AccountImage}
            roundedCircle
            src={account?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className={`${styles.UsernameHeader} m-2`}>
            {formatOwnerName(account?.owner)}
          </h3>
        </Col>
        {account?.content && (
          <Col xs={12} md={12} className={`${styles.BioContent} p-3`}>
            {account.content}
          </Col>
        )}
      </Row>
    </>
  );

  const mainAccountTasks = (
    <>
      <hr className={styles.CustomHR} />
      <p className={`${styles.OwnersTasks} text-center`}>
        {formatOwnerName(account?.owner)}'s tasks
      </p>
      {accountTasks.results.length ? (
        <InfiniteScroll
          children={accountTasks.results.map((task) => (
            <Task key={task.id} {...task} setTasks={setAccountTasks} />
          ))}
          dataLength={accountTasks.results.length}
          loader={<Asset spinner />}
          hasMore={!!accountTasks.next}
          next={() => fetchMoreData(accountTasks, setAccountTasks)}
        />
      ) : (
        <Row className="justify-content-center">
          <Col xs={12} sm={12} md={12} className={styles.NoTasks}>
            <Asset
              src={NoResults}
              message={`${formatOwnerName(
                account?.owner
              )} has no public tasks.`}
            />
          </Col>
        </Row>
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <NewestAccounts mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainAccount}
              {mainAccountTasks}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <NewestAccounts />
      </Col>
    </Row>
  );
}

export default AccountPage;
