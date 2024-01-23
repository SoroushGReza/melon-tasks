import React from "react";
import styles from "../../styles/Account.module.css";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";

// Account component
const Account = (props) => {
  // Destructuring props to extract 'account', 'mobile', and 'imageSize' with default value
  const { account, mobile, imageSize = 45 } = props;
  // Ddestructuring 'account' to get 'id', 'image' and 'owner'
  const { id, image, owner } = account;

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
