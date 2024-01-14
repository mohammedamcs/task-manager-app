export const formatDate = (
  date,
  config = {
    weekday: "short",
    month: "short",
    day: "numeric",
  }
) => {
  return new Date(date).toLocaleDateString("en-us", config);
};

// To filter tasks based on task status
export const filterTasks = (tasks, status) => {
  if (status !== "all") return sortTasks(tasks.filter((task) => task.status === status));

  const doneTasks = sortTasks(tasks.filter((task) => task.status === "done"));
  const unfinishedTasks = sortTasks(tasks.filter((task) => task.status === "unfinished"));
  const ongoingTasks = sortTasks(tasks.filter((task) => task.status === "ongoing"));
  return [...ongoingTasks, ...unfinishedTasks, ...doneTasks];
};

// Sort tasks based on due date
const sortTasks = (tasks)=> tasks.sort((a,b)=> new Date(a.due) - new Date(b.due));

// Singular or plural task
export const taskOrTasks = (numberOfTasks) =>
  numberOfTasks < 2 ? "task" : "tasks";
