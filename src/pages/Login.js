import { useSelector } from "react-redux";
import { Form, Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import Loading from "../components/Loading";
import { store } from "../store";
import { login } from "../features/auth/authSlice";

export const loginAction = async ({ request }) => {
  try {
    const userData = Object.fromEntries(await request.formData());
    // Check if all user data are provided
    if (!userData.email) throw new Error("Email is missing");
    if (!userData.password) throw new Error("Password is missing");
    // login user
    store.dispatch(login(userData));
  } catch (error) {
    toast.error(error.message);
  }
  return null;
};

function Login() {
  const { isUserLoggedIn, isAuthLoading } = useSelector((store) => store.auth);
  const firstInputRef = useRef();
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  if (isAuthLoading) {
    return <Loading />;
  }

  if (isUserLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="form-wrapper">
      <h3>Login</h3>
      <Form className="form" method="post">
        <div className="input">
          <input
            type="email"
            name="email"
            id="email"
            required
            ref={firstInputRef}
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input">
          <input type="password" name="password" id="password" required />
          <label htmlFor="password">Password</label>
        </div>
        <div className="buttons">
          <button className="btn" id="loginBtn">
            Login
          </button>
          <p>
            Or if you don't have an account try to{" "}
            <Link to={`/register`}>Register</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
export default Login;
