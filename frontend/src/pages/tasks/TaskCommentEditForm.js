import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

function TaskCommentEditForm(props) {
  const { id, taskId, content, setShowEditForm, setComments } = props;
  const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedContent = formContent.trim();
    if (!trimmedContent) {
      console.error("Comment content cannot be empty.");
      return;
    }

    try {
      await axiosRes.put(`/comments/${id}/`, {
        task: taskId,
        content: trimmedContent,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) =>
          comment.id === id ? { ...comment, content: trimmedContent } : comment
        ),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.error("Error updating comment:", err.response.data);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button onClick={() => setShowEditForm(false)} type="button">
          cancel
        </button>
        <button disabled={!formContent.trim()} type="submit">
          save
        </button>
      </div>
    </Form>
  );
}

export default TaskCommentEditForm;
