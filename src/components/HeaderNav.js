import { useSelector } from "react-redux";
import SignedOutNav from "./SignedOutNav";
import SignedInNav from "./SignedInNav";

function HeaderNav() {
  const { isUserLoggedIn } = useSelector((store) => store.auth);

  return isUserLoggedIn ? <SignedInNav /> : <SignedOutNav />;
}
export default HeaderNav;
