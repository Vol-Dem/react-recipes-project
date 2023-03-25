import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.scss";

function MainNavigation() {
  return (
    <nav>
      <ul className={classes.nav}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="about">About</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default MainNavigation;
