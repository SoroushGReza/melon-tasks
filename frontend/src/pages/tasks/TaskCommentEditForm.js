import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/TaskCommentEditForm.module.css";

function TaskCommentEditForm(props) {
  const { id, taskId, content, setShowEditForm, setComments } = props;

  // state to manage content of the form
  const [formContent, setFormContent] = useState(content);

  // Event handler for changes in the form input
  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  // Event handler for form submission
  const handleSubmit = async (event) => {
    // Prevents the default form submission behaviour
    event.preventDefault();

    // Trim content to remove trailing whitespaces
    const trimmedContent = formContent.trim();

    // Check if trimmed content is empty and logs an error if true
    if (!trimmedContent) {
      console.error("Comment content cannot be empty.");
      return;
    }

    try {
      // Sends a PUT request to update the comment with the new content
      await axiosRes.put(`/comments/${id}/`, {
        task: taskId,
        content: trimmedContent,
      });

      // Updates the comments state with the new comment content
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id ? { ...comment, content: trimmedContent } : comment
        ),
      }));

      // Closes the edit form
      setShowEditForm(false);
    } catch (err) {
      // Logs an error message if the update operation fails
      console.error("Error updating comment:", err.response.data);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={styles.BtnCancel}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
        <button
          className={styles.BtnSave}
          disabled={!formContent.trim()}
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default TaskCommentEditForm;
