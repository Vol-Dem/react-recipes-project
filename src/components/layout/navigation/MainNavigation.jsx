import { NavLink, useLocation } from "react-router-dom";
import classes from "./MainNavigation.module.scss";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const NavItem = (props) => {
  const { to, className } = props;
  const location = useLocation();

  const activePath =
    to === location.pathname ||
    to === location.pathname.slice(1, location.pathname.length);
  return (
    <li>
      <NavLink to={to} className={(nav) => (nav.isActive ? className : "")}>
        {props.children}
      </NavLink>
      {activePath && (
        <motion.div
          layoutId="nav-indicator"
          className={classes["nav__indicator"]}
        ></motion.div>
      )}
    </li>
  );
};

function MainNavigation() {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);

  return (
    <>
      <nav className={classes.nav}>
        <ul className={classes["nav__links"]}>
          <NavItem to="/" className={classes.active}>
            Home
          </NavItem>
          {isAuth && (
            <>
              <NavItem to="profile" className={classes.active}>
                Profile
              </NavItem>
              <NavItem to="favorites" className={classes.active}>
                Favorites
              </NavItem>
            </>
          )}
          <NavItem to="about" className={classes.active}>
            About
          </NavItem>
        </ul>
      </nav>
    </>
  );
}

export default MainNavigation;
