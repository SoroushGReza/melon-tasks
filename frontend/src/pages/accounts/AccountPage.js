import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/AccountPage.module.css";
import appStyles from "../../App.module.css";

import Task from "../tasks/Task.js";
import { fetchMoreData } from "../../utils/utils.js";
import NoResults from "../../assets/no-results.png";

import PermittedAccounts from "./PermittedAccounts";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useAccountData,
  useSetAccountData,
} from "../../contexts/AccountDataContext";
import { Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

function AccountPage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [accountTasks, setAccountTasks] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const setAccountData = useSetAccountData();
  const { pageAccount } = useAccountData();
  const [account] = pageAccount.results;
  const is_owner = currentUser?.username === account?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageAccount }, { data: accountTasks }] =
          await Promise.all([
            axiosReq.get(`/accounts/${id}/`),
            axiosReq.get(`/tasks/?owner__account=${id}`),
          ]);
        setAccountData((prevState) => ({
          ...prevState,
          pageAccount: { results: [pageAccount] },
        }));
        setAccountTasks(accountTasks);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, setAccountData]);

  const mainAccount = (
    <>
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.AccountImage}
            roundedCircle
            src={account?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{account?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col xs={3} className="my-2">
              <p>For later</p>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (account?.permit_users ? (
              <Button className={styles.UnauthorizeBtn} onClick={() => {}}>
                Unauthorize
              </Button>
            ) : (
              <Button className={styles.AuthorizeBtn} onClick={() => {}}>
                Authorize
              </Button>
            ))}
        </Col>
        {account?.content && <Col className="p-3">{account.content}</Col>}
      </Row>
    </>
  );

  const mainAccountTasks = (
    <>
      <hr />
      <p className="text-center">{account?.owner}'s tasks</p>
      <hr />
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
        <Asset
          src={NoResults}
          message={`No tasks found, ${account?.owner} hasn't posted yet.`}
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PermittedAccounts mobile />
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
        <PermittedAccounts />
      </Col>
    </Row>
  );
}

export default AccountPage;
