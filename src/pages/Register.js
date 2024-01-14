import { Form, Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { store } from "../store";
import { registerUser } from "../features/auth/authSlice";
import Loading from "../components/Loading";

export const registerAction = async ({ request }) => {
  try {
    const userData = Object.fromEntries(await request.formData());
    // Check if all user data are provided
    if (!userData.username) throw new Error("Username is missing");
    if (!userData.email) throw new Error("Email is missing");
    if (!userData.password) throw new Error("Password is missing");
    // register user
    store.dispatch(registerUser(userData));
  } catch (error) {
    toast.error(error.message);
  }

  return null;
};

function Register() {
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
      <h3>Register</h3>
      <Form className="form" method="post">
        <div className="input">
          <input
            type="username"
            name="username"
            id="username"
            ref={firstInputRef}
            required
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="input">
          <input type="email" name="email" id="email" required />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input">
          <input type="password" name="password" id="password" required />
          <label htmlFor="password">Password</label>
        </div>
        <div className="buttons">
          <button className="btn" id="registerBtn">
            Register
          </button>
          <p>
            Or if you already have an account try to{" "}
            <Link to={`/login`}>login</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
export default Register;
