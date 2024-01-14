import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./features/modal/modalSlice";
import taskReducer from "./features/task/taskSlice";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    task: taskReducer,
  },
});
