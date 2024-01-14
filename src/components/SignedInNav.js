import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

function SignedInNav() {
  const dispatch = useDispatch();

  return (
    <nav>
      <div className="left">
        <Link to="tasks/all">tasks</Link>
      </div>
      <div className="right">
        <Link to="/login" onClick={() => dispatch(logout())}>
          logout
        </Link>
      </div>
    </nav>
  );
}
export default SignedInNav;
