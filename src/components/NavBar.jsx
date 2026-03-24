import { Link, Outlet } from "react-router-dom";
import "./NavBar.css"
import logo from "/images/Generosource.svg"


function NavBar() {
  const token =localStorage.getItem("token");
  const isLoggedIn = !!token;

  return (
    <div className="site-wrapper">
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Generosource logo" className="nav-logo" />
        </Link>
        
        <div className="nav-actions">
          {isLoggedIn ? (
            <Link to="/profile" className="nav-button profile-button">
              My profile
            </Link>
            ) : (
                <Link to="/login" className="nav-button login-button">
                    Log in
                </Link>
            )}
        </div>
      </ nav>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default NavBar;