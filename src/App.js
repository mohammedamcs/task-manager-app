
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

// Layouts
import RootLayout from "./layouts/RootLayout";
import TasksLayout from "./layouts/TasksLayout";

// Pages
import Tasks, { tasksAction } from "./pages/Tasks";
import Login, { loginAction } from "./pages/Login";
import Register, { registerAction } from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";

// protected routes
import Protected from "./components/Protected";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<RootLayout />}
      errorElement={
        <RootLayout>
          <ErrorPage />
        </RootLayout>
      }
    >
      <Route index element={<Navigate to="tasks" />} />
      <Route path="tasks" element={<TasksLayout />}>
        <Route index element={<Navigate to="all" />} />
        <Route
          path=":taskStatus"
          element={
            <Protected>
              <Tasks />
            </Protected>
          }
          action={tasksAction}
        />
      </Route>
      <Route path="login" element={<Login />} action={loginAction} />
      <Route path="register" element={<Register />} action={registerAction} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
