import React from "react";
import styles from "../../styles/Account.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { Button } from "react-bootstrap";

const Account = (props) => {
  const { account, mobile, imageSize = 45 } = props;
  const { id, permit_users, image, owner } = account;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  return (
    <div
      className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}
    >
      <div>
        <Link className="align-self-center" to={`/accounts/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {!mobile &&
          currentUser &&
          !is_owner &&
          (permit_users ? (
            <Button
              className={styles.UnauthorizeBtn}
              onClick={() => {}}
            >
              Unauthorize
            </Button>
          ) : (
            <Button
            className={styles.AuthorizeBtn}
              onClick={() => {}}
            >
              Authorize
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Account;
