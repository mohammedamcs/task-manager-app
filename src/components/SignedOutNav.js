import { Link } from "react-router-dom"

function SignedOutNav() {
  return (
    <nav>
      <div className="left">
        
      </div>
      <div className="right">
        <Link to="login">login</Link>
        <Link to="register">register</Link>
      </div>
    </nav>
  )
}
export default SignedOutNav