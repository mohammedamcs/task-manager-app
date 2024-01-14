import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Protected({ children }) {
  const { isUserLoggedIn } = useSelector((store) => store.auth);


  

  if (!isUserLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}
export default Protected;
