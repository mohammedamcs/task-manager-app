import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

// Slice initial state
const initialState = {
  tasks: [],
  status: {
    total: 0,
    done: 0,
    unfinished: 0,
    ongoing: 0,
  },
  tasksForToday: 0,
  isTasksLoading: false,
};

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (userId) => {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ ...doc.data(), id: doc.id });
    });
    return tasks;
  }
);

export const addTask = createAsyncThunk("task/addTask", async (taskData) => {
  const docRef = await addDoc(collection(db, "tasks"), taskData);
  const docSnap = await getDoc(docRef);
  return { ...docSnap.data(), id: docSnap.id };
});

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (taskData) => {
    const { id: taskId, ...updates } = taskData;
    const tasksRef = doc(db, "tasks", taskId);
    await updateDoc(tasksRef, { ...updates });
    return taskData;
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTaskTask",
  async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
    return taskId;
  }
);

// Creating task slice
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    calculateTaskStatus: (state) => {
      const doneTasks = state.tasks.filter(
        (task) => task.status === "done"
      ).length;
      const ongoingTasks = state.tasks.filter(
        (task) => task.status === "ongoing"
      ).length;
      const unfinishedTasks = state.tasks.length - (doneTasks + ongoingTasks);

      state.status.total = state.tasks.length;
      state.status.done = doneTasks;
      state.status.ongoing = ongoingTasks;
      state.status.unfinished = unfinishedTasks;
    },
    calculateTasksForToday: (state) => {
      const today = new Date().toISOString().split("T")[0];
      let count = 0;
      for (let task of state.tasks) {
        if (task.status !== "done") {
          if (task.due === today) {
            count++;
          }
        }
      }

      state.tasksForToday = count;
    },
    clearTaskState: (state) => {
      state.tasks = [];
      for (let key in state.status) {
        state.status[key] = 0;
      }
      state.tasksForToday = 0;
      state.isTasksLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTask.pending, (state) => {
        state.isTasksLoading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const newTask = action.payload;
        state.tasks.push(newTask);
        state.isTasksLoading = false;
        toast.success("a new task is added successfully");
      })
      .addCase(addTask.rejected, (state, action) => {
        state.isTasksLoading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTasks.pending, (state) => {
        state.tasks = [];
        for (let key in state.status) {
          state.status[key] = 0;
        }
        state.tasksForToday = 0;
        state.isTasksLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const tasks = action.payload;
        state.tasks = tasks;
        state.isTasksLoading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.tasks = [];
        for (let key in state.status) {
          state.status[key] = 0;
        }
        state.tasksForToday = 0;
        state.isTasksLoading = false;
        toast.error(action.error.message);
      })
      .addCase(updateTask.pending, (state) => {
        state.isTasksLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id: taskId, ...updates } = action.payload;
        let foundTask = state.tasks.find((task) => task.id === taskId);
        for (let key in updates) {
          foundTask[key] = updates[key];
        }
        state.isTasksLoading = false;
        toast.success("task is updated successfully");
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isTasksLoading = false;
        toast.error(action.payload.error);
      })
      .addCase(deleteTask.pending, (state) => {
        state.isTasksLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload;
        state.tasks = state.tasks.filter((task) => task.id !== taskId);
        state.isTasksLoading = false;
        toast.success("task is deleted successfully");
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isTasksLoading = false;
        toast.error(action.error.message);
      });
  },
});

export const taskActions = taskSlice.actions;

export default taskSlice.reducer;
