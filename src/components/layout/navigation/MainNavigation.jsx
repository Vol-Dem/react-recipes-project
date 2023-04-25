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
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="about">About</NavLink>
          </li>
          {isAuth && (
            <>
              <li>
                <NavLink to="profile">Profile</NavLink>
              </li>
              <li>
                <NavLink to="favorites">Favorites</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}

export default MainNavigation;
