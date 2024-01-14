import { useDispatch } from "react-redux";
import { Form } from "react-router-dom";
import { modalActions } from "../features/modal/modalSlice";
import closeModal from "../assets/icons/close.png";
import { useEffect, useRef } from "react";

function CreateTaskForm() {
  const dispatch = useDispatch();
  const firstInputRef = useRef();

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  return (
    <div className="form-wrapper">
      <button
        id="closeBtn"
        onClick={() => {
          dispatch(modalActions.toggleCreateTaskModal());
        }}
      >
        <img src={closeModal} alt="close-modal-icon" />
      </button>
      <h3>create a task</h3>
      <Form className="form" method="post">
        <div className="input">
          <input
            type="text"
            name="title"
            id="title"
            required
            ref={firstInputRef}
          />
          <label htmlFor="title">Title</label>
        </div>
        <div className="input w-50">
          <input type="date" name="date" id="date" required />
          <label htmlFor="date">due date</label>
        </div>
        <input type="hidden" name="action" value="createTask" />
        <button className="btn" id="loginBtn">
          Create
        </button>
      </Form>
    </div>
  );
}
export default CreateTaskForm;
