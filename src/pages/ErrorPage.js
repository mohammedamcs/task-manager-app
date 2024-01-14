import { useNavigate, useRouteError } from "react-router-dom";
function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="error">
      <h3>{error.status}</h3>
      <h4>Oops! Something went wrong</h4>
      {(error.message || error.error.message || error.data) && (
        <p>this is all what we know: {error.message|| error.error.message || error.data}</p>
      )}
      <div className="buttons">
        <button onClick={() => navigate("/")}>Go Home</button>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    </div>
  );
}
export default ErrorPage;
