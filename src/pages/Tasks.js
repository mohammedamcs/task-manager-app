import Task from "../components/Task";
import Modal from "../components/Modal";
import { store } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { addTask, fetchTasks, updateTask } from "../features/task/taskSlice";
import { modalActions } from "../features/modal/modalSlice";
import { useParams } from "react-router-dom";
import { filterTasks } from "../helpers";
import empty from "../assets/images/box.png";
import { toast } from "react-toastify";
import { auth } from "../config/firebase";
import { useEffect } from "react";
import Loading from "../components/Loading";

// forms submitted to tasks page handler
export const tasksAction = async ({ request }) => {
  try {
    const { action, ...others } = Object.fromEntries(await request.formData());

    // Create  task
    if (action === "createTask") {
      const { title, date } = others;
      // check if all task data is available
      if (!title) throw new Error("task title is missing");
      if (!date) throw new Error("task due date is missing");
      // add new task
      const newTask = {
        userId: auth.currentUser.uid,
        title,
        status: "unfinished",
        due: date,
      };
      store.dispatch(addTask(newTask));
      store.dispatch(modalActions.toggleCreateTaskModal());
    }
    // Update task
    if (action === "updateTask") {
      const { updatedTitle, updatedDate, id, updatedStatus } = others;
      // check if all task data is available
      if (!updatedTitle) throw new Error("task title is missing");
      if (!updatedDate) throw new Error("task due date is missing");
      // update task
      store.dispatch(
        updateTask({
          id,
          title: updatedTitle,
          status: updatedStatus,
          due: updatedDate,
        })
      );
      store.dispatch(modalActions.toggleUpdateTaskModal({ task: null }));
    }
  } catch (error) {
    toast.error(error.message);
  }
  return null;
};

function Tasks() {
  const { tasks, isTasksLoading } = useSelector((store) => store.task);
  const { showCreateTaskModal, updateTaskModal } = useSelector(
    (store) => store.modal
  );
  const { taskStatus } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.currentUser) {
      dispatch(fetchTasks(auth.currentUser.uid));
    }
  }, [dispatch]);

  if (isTasksLoading) {
    return <Loading />;
  }

  const filteredTasks = filterTasks(tasks, taskStatus);
  if (filteredTasks.length === 0) {
    return (
      <div className="tasks">
        {(showCreateTaskModal || updateTaskModal.show) && <Modal />}
        <img src={empty} alt="empty-tasks" />
      </div>
    );
  }
  return (
    <div className="tasks">
      {(showCreateTaskModal || updateTaskModal.show) && <Modal />}
      {filteredTasks.map((task) => {
        return <Task task={task} key={task.id}></Task>;
      })}
    </div>
  );
}
export default Tasks;
