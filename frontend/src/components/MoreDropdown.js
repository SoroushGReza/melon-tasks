import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useHistory } from "react-router-dom";

// Dropdown for editing user Account

export function AccountEditDropdown({ id }) {
  const history = useHistory();
  return (
    <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={DotsDropDown} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => history.push(`/accounts/${id}/edit`)}
          aria-label="manage-account"
        >
          <i className="fas fa-edit" /> manage account
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/accounts/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="far fa-id-card" />
          change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/accounts/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="fas fa-key" />
          change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

// Dropdown for Edit/Delete Tasks and Comments

const DotsDropDown = React.forwardRef(({ onClick }, ref) => (
  <i
    className={`fa-solid fa-ellipsis-vertical ${styles.DotsIcon}`}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const MoreDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={DotsDropDown} />

      <Dropdown.Menu
        className={`text-center ${styles.CustomDropdownMenu}`}
        popperConfig={{ strategy: "fixed" }}
      >
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleEdit}
          aria-label="edit"
        >
          <i
            className={`fa-solid fa-pen-to-square ${styles.MoreDropdownIcon}`}
          />{" "}
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleDelete}
          aria-label="delete"
        >
          <i className={`fas fa-trash-alt ${styles.MoreDropdownIcon}`} />{" "}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
