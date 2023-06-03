import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.scss";
import { useSelector } from "react-redux";

function MainNavigation() {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);

  return (
    <>
      <nav className={classes.nav}>
        <ul className={classes["nav__links"]}>
          <li>
            <NavLink
              to="/"
              className={(nav) => (nav.isActive ? classes.active : "")}
            >
              Home
            </NavLink>
          </li>
          {isAuth && (
            <>
              <li>
                <NavLink
                  to="profile"
                  className={(nav) => (nav.isActive ? classes.active : "")}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="favorites"
                  className={(nav) => (nav.isActive ? classes.active : "")}
                >
                  Favorites
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink
              to="about"
              className={(nav) => (nav.isActive ? classes.active : "")}
            >
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default MainNavigation;
