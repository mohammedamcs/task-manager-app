import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { modalActions } from "../features/modal/modalSlice";
import { useEffect } from "react";
import { taskActions } from "../features/task/taskSlice";
import { formatDate, taskOrTasks } from "../helpers";
import Loading from "../components/Loading";

function TasksLayout() {
  const { tasks, status, tasksForToday, isTasksLoading } = useSelector(
    (store) => store.task
  );
  const { user, isAuthLoading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isTasksLoading) {
      dispatch(taskActions.calculateTaskStatus());
      dispatch(taskActions.calculateTasksForToday());
    }
  }, [tasks, dispatch, isTasksLoading]);

  if (isAuthLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="tasks-side">
        <div className="greeting">
          <span className="date">
            It's{" "}
            {formatDate(new Date(), {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="msg">Welcome Back</span>
          <span className="username">{user?.username}</span>
          <span className="tasks-today">
            You've to complete <br />{" "}
            <span>{`${tasksForToday} ${taskOrTasks(tasksForToday)}`}</span>{" "}
            today
          </span>
        </div>
        <div className="progress-info-wrapper">
          <div className="tasks-infos">
            <h3>Tasks Infos</h3>
            <div className="info">
              <span className="all-tasks"></span>
              <span> {status.total} {`${taskOrTasks(status.total)}`} in total</span>
            </div>
            <div className="info">
              <span className="done-tasks"></span>
              <span> {status.done} Done {`${taskOrTasks(status.done)}`}</span>
            </div>
            <div className="info">
              <span className="ongoing-tasks"></span>
              <span> {status.ongoing} Ongoing {`${taskOrTasks(status.ongoing)}`}</span>
            </div>
            <div className="info">
              <span className="unfinished-tasks"></span>
              <span>{status.unfinished} unfinished {`${taskOrTasks(status.unfinished)}`}</span>
            </div>
          </div>
          <div
            className="tasks-progress"
            style={{ "--deg": `${(status.done / status.total) * 360}deg` }}
          >
            <h3>tasks progress</h3>
            <div className="progress">
              <div className="value">
                <span>{status.done}</span>
                <span>/{status.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tasks-wrapper">
        <div className="tasks-header">
          <NavLink to={"all"}>
            <span className="all-tasks"></span>
          </NavLink>
          <NavLink to="done">
            <span className="done-tasks"></span>
          </NavLink>
          <button
            id="createTaskBtn"
            onClick={() => {
              dispatch(modalActions.toggleCreateTaskModal());
            }}
          >
            create task
          </button>
          <NavLink to="ongoing">
            <span className="ongoing-tasks"></span>
          </NavLink>
          <NavLink to="unfinished">
            <span className="unfinished-tasks"></span>
          </NavLink>
        </div>
        <Outlet />
      </div>
    </>
  );
}
export default TasksLayout;
