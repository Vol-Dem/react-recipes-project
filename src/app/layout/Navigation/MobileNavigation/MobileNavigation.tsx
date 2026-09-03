"use client";

import { useEffect, useRef, useState } from "react";
import classes from "./MobileNavigation.module.scss";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectAuthIsLoggedIn } from "../../../../features/auth/store/authSelectors";

const MobileNavigation = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const isAuth = useSelector(selectAuthIsLoggedIn);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navIsOpen) {
      return undefined;
    }

    navigationRef.current?.querySelector("a")?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [navIsOpen]);

  const navSwitch = () => {
    setNavIsOpen((previousNavIsOpen) => {
      if (previousNavIsOpen) {
        menuButtonRef.current?.focus();
      }

      return !previousNavIsOpen;
    });
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
        ref={menuButtonRef}
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
      <div
        className={classes["mobile-nav__background"]}
        aria-hidden="true"
      ></div>
      {navIsOpen && (
        <nav
          ref={navigationRef}
          id="mobile-navigation"
          className={classes["mobile-nav__nav"]}
          aria-label="Mobile navigation"
        >
          <ul className={classes["mobile-nav__links"]}>
            <li>
              <Link href="/" onClick={closeNavigation}>
                Home
              </Link>
            </li>
            {isAuth && (
              <>
                <li>
                  <Link href="/profile" onClick={closeNavigation}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/favorites" onClick={closeNavigation}>
                    Favorites
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href="/about" onClick={closeNavigation}>
                About
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default MobileNavigation;
