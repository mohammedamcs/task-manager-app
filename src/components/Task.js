import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../features/task/taskSlice";
import deleteIcon from "../assets/icons/delete.png";
import editIcon from "../assets/icons/edit.png";
import favoriteIcon from "../assets/icons/favorite.png";
import doneIcon from "../assets/icons/done-task.png";
import { formatDate } from "../helpers";
import { modalActions } from "../features/modal/modalSlice";

function Task({ task }) {
  const { status, title, due, id } = task;
  
  const dispatch = useDispatch();
  return (
    <>
      
      <div className={`task ${status}`}>
        {status !== "done" && (
          <button
            id="finishedTaskBtn"
            onClick={() => dispatch(updateTask({ id, status: "done" }))}
          >
            <img src={doneIcon} alt="task-finished-icon" />
          </button>
        )}
        <p className="text">{title}</p>
        <div className="info-actions-wrapper">
          <div className="infos">
            <span>Due: {formatDate(due).toLowerCase()}</span>
          </div>
          <div className="actions">
            {!["done", "ongoing"].includes(status) && (
              <button
                id="ongoingTaskBtn"
                onClick={() => dispatch(updateTask({ id, status: "ongoing" }))}
              >
                <img src={favoriteIcon} alt="favorite-icon" />
              </button>
            )}
            <button
              id="editTaskBtn"
              onClick={() => {
                dispatch(
                  modalActions.toggleUpdateTaskModal({
                    task,
                  })
                );
              }}
            >
              <img src={editIcon} alt="edit-icon" />
            </button>
            <button id="deleteTaskBtn" onClick={() => dispatch(deleteTask(id))}>
              <img src={deleteIcon} alt="delete-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Task;
