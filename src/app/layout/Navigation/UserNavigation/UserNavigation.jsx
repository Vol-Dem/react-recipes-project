"use client";

import classes from "./UserNavigation.module.scss";
import UserIcon from "../../../../assets/icons/user.svg?react";
import ButtonSecondary from "../../../../shared/components/ui/ButtonSecondary/ButtonSecondary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../../features/auth/store/authThunks";
import { selectAuthDisplayName } from "../../../../features/auth/store/authSelectors";
import { useEffect, useRef, useState } from "react";

const UserNavigation = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const userName = useSelector(selectAuthDisplayName);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!menuIsOpen) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setMenuIsOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuIsOpen]);

  const openMenu = () => setMenuIsOpen(true);
  const closeMenu = () => setMenuIsOpen(false);
  const handleTriggerClick = (event) => {
    if (event.detail === 0) {
      setMenuIsOpen((isOpen) => !isOpen);
      return;
    }

    openMenu();
  };

  const logout = () => {
    closeMenu();
    dispatch(logoutUser());
    router.replace("/");
  };

  return (
    <div
      ref={containerRef}
      className={`${classes["nav-profile"]} ${
        menuIsOpen ? classes["nav-profile--open"] : ""
      }`}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        ref={triggerRef}
        type="button"
        className={classes["nav-profile__user"]}
        aria-expanded={menuIsOpen}
        aria-controls="user-navigation-menu"
        onClick={handleTriggerClick}
      >
        <span className={classes["nav-profile__name"]}>{userName}</span>
        <UserIcon aria-hidden="true" focusable="false" />
      </button>
      <div
        id="user-navigation-menu"
        className={classes["nav-profile__menu"]}
        aria-hidden={!menuIsOpen}
        inert={!menuIsOpen}
      >
        <ul className={classes["nav-profile__links"]}>
          <li className={classes["nav-profile__link"]}>
            <Link href="/profile" onClick={closeMenu}>
              Profile
            </Link>
          </li>
          <li className={classes["nav-profile__link"]}>
            <Link href="/favorites" onClick={closeMenu}>
              Favorites
            </Link>
          </li>
        </ul>
        <ButtonSecondary type="button" onClick={logout}>
          Logout
        </ButtonSecondary>
      </div>
    </div>
  );
};

export default UserNavigation;
