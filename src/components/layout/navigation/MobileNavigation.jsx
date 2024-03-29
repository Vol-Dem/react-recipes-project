import { useState } from "react";
import classes from "./MobileNavigation.module.scss";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const MobileNavigation = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const isAuth = useSelector((state) => state.auth.isLoggedIn);

  const navSwitch = () => {
    setNavIsOpen((prevState) => !prevState);
  };

  return (
    <div
      className={`${classes["mobile-nav"]} ${
        navIsOpen ? classes["mobile-nav--open"] : ""
      }`}
    >
      <div className={classes["mobile-nav__button"]} onClick={navSwitch}>
        <span className={classes["mobile-nav__icon"]}></span>
      </div>
      <div className={classes["mobile-nav__background"]}></div>
      <nav className={classes["mobile-nav__nav"]}>
        <ul className={classes["mobile-nav__links"]} onClick={navSwitch}>
          <li>
            <NavLink to="/">Home</NavLink>
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
          <li>
            <NavLink to="about">About</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileNavigation;
