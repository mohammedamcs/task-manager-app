import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/auth/authSlice";

function RootLayout({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(fetchUser(user.uid));
      }
    });
  });

  return (
    <div className="app">
      <Header />
      <main>{children ?? <Outlet />}</main>
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
}
export default RootLayout;
