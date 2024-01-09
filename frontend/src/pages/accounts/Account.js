import React from "react";
import styles from "../../styles/Account.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

const Account = (props) => {
  const { account, mobile, imageSize = 45 } = props;
  const { id, image, owner } = account;

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
        <Link className="align-self-center" to={`/accounts/${id}`}>
          <strong>{owner}</strong>
        </Link>
      </div>
    </div>
  );
};

export default Account;
