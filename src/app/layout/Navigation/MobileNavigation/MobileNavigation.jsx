import { useState } from "react";
import classes from "./MobileNavigation.module.scss";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthIsLoggedIn } from "../../../../features/auth/store/authSelectors";

const MobileNavigation = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const isAuth = useSelector(selectAuthIsLoggedIn);

  const navSwitch = () => {
    setNavIsOpen((prevState) => !prevState);
  };
  const closeNavigation = () => {
    setNavIsOpen(false);
  };

  return (
    <div
      className={`${classes["mobile-nav"]} ${
        navIsOpen ? classes["mobile-nav--open"] : ""
      }`}
    >
      <button
        type="button"
        className={classes["mobile-nav__button"]}
        onClick={navSwitch}
        aria-expanded={navIsOpen}
        aria-controls="mobile-navigation"
        aria-label={
          navIsOpen ? "Close navigation menu" : "Open navigation menu"
        }
      >
        <span className={classes["mobile-nav__icon"]}></span>
      </button>
      <div className={classes["mobile-nav__background"]}></div>
      <nav id="mobile-navigation" className={classes["mobile-nav__nav"]}>
        <ul className={classes["mobile-nav__links"]}>
          <li>
            <NavLink to="/" onClick={closeNavigation}>
              Home
            </NavLink>
          </li>
          {isAuth && (
            <>
              <li>
                <NavLink to="profile" onClick={closeNavigation}>
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="favorites" onClick={closeNavigation}>
                  Favorites
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink to="about" onClick={closeNavigation}>
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileNavigation;
