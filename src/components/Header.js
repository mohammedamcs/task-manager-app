import logoImage from "../assets/images/logo.svg";
import HeaderNav from "./HeaderNav";
function Header() {
  return (
    <header>
      <div className="logo">
        <img src={logoImage} alt="logo-img" />
      </div>
      <HeaderNav />
    </header>
  );
}
export default Header;
