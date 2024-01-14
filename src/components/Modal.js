import { useSelector } from "react-redux";
import CreateTaskForm from "./CreateTaskForm";
import UpdateTaskForm from "./UpdateTaskForm";

function Modal() {
  const { showCreateTaskModal, updateTaskModal } = useSelector(
    (store) => store.modal
  );

  if (showCreateTaskModal) {
    return (
      <div className="modal">
        <CreateTaskForm />
      </div>
    );
  }

  if (updateTaskModal.show) {
    return (
      <div className="modal">
        <UpdateTaskForm {...updateTaskModal.task} />
      </div>
    );
  }
  return;
}
export default Modal;
