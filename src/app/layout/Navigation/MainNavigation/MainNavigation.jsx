"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./MainNavigation.module.scss";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { selectAuthIsLoggedIn } from "../../../../features/auth/store/authSelectors";

const NavItem = ({ children, className, href }) => {
  const pathname = usePathname();

  const isActive =
    href === "/"
      ? pathname === "/" || pathname.startsWith("/recipe/")
      : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <li>
      <Link href={href} className={isActive ? className : ""}>
        {children}
      </Link>
      {isActive && (
        <motion.div
          aria-hidden="true"
          layoutId="nav-indicator"
          className={classes["nav__indicator"]}
        ></motion.div>
      )}
    </li>
  );
};

const MainNavigation = () => {
  const isAuth = useSelector(selectAuthIsLoggedIn);

  return (
    <nav className={classes.nav}>
      <ul className={classes["nav__links"]}>
        <NavItem href="/" className={classes.active}>
          Home
        </NavItem>
        {isAuth && (
          <>
            <NavItem href="/profile" className={classes.active}>
              Profile
            </NavItem>
            <NavItem href="/favorites" className={classes.active}>
              Favorites
            </NavItem>
          </>
        )}
        <NavItem href="/about" className={classes.active}>
          About
        </NavItem>
      </ul>
    </nav>
  );
};

export default MainNavigation;
