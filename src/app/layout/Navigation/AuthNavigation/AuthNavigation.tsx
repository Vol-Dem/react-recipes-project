"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store";
import { selectAuthIsLoggedIn } from "../../../../features/auth/store/authSelectors";
import { authActions } from "../../../../features/auth/store/authSlice";
import Button from "../../../../shared/components/ui/Button/Button";
import UserNavigation from "../UserNavigation/UserNavigation";
import classes from "./AuthNavigation.module.scss";

const AuthNavigation = () => {
  const isAuth = useSelector(selectAuthIsLoggedIn);
  const dispatch = useDispatch<AppDispatch>();

  const openAuth = () => {
    dispatch(authActions.openAuthForm());
  };

  if (isAuth) return <UserNavigation />;

  return (
    <Button onClick={openAuth} className={classes["btn-auth"]}>
      Sign In
    </Button>
  );
};

export default AuthNavigation;
