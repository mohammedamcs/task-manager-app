import { useDispatch } from "react-redux";
import { Form } from "react-router-dom";
import { modalActions } from "../features/modal/modalSlice";
import closeModal from "../assets/icons/close.png";
import { useEffect, useRef, useState } from "react";

function UpdateTaskForm({ title, due, id, status }) {
  const dispatch = useDispatch();
  const [updates, setUpdates] = useState({
    updatedTitle: title,
    updatedDate: due,
  });
  const firstInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdates({ ...updates, [name]: value });
  };

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
          dispatch(modalActions.toggleUpdateTaskModal({ task: null }));
        }}
      >
        <img src={closeModal} alt="close-modal-icon" />
      </button>
      <h3>update task</h3>
      <Form className="form" method="post">
        <div className="input">
          <input
            type="text"
            name="updatedTitle"
            id="updatedTitle"
            value={updates.updatedTitle}
            onChange={handleChange}
            required
            ref={firstInputRef}
          />
          <label htmlFor="updatedTitle">Title</label>
        </div>
        <div className="input">
          <input
            type="date"
            name="updatedDate"
            id="updatedDate"
            value={updates.updatedDate}
            onChange={handleChange}
            required
          />
          <label htmlFor="updatedDate">due date</label>
        </div>
        <div className="input">
          <select name="updatedStatus" id="status" defaultValue={status}>
            {["done", "ongoing", "unfinished"].map((el, i) => (
              <option name={el} value={el} key={i}>
                {el}
              </option>
            ))}
          </select>
          <label htmlFor="status">status</label>
        </div>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="action" value="updateTask" />
        <button className="btn warning" id="loginBtn">
          Update
        </button>
      </Form>
    </div>
  );
}
export default UpdateTaskForm;
