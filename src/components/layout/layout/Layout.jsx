import Header from "../header/Header";
import classes from "./Layout.module.scss";
import MainNavigation from "../navigation/MainNavigation";
import { Outlet } from "react-router-dom";
import MobileNavigation from "../navigation/MobileNavigation";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/auth";
import UserNavigation from "../navigation/UserNavigation";
import Buttton from "../../ui/Button";
import Modal from "../../ui/Modal";
import AuthForm from "../../Auth/AuthForm";
import ErrorBoundary from "../../error-boundary/ErrorBoundary";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const authIsOpen = useSelector((state) => state.auth.authFormIsOpen);
  const dispatch = useDispatch();

  const location = useLocation();
  const [locationPath, setLocationPath] = useState(0);

  useEffect(() => {
    setLocationPath(location.pathname);
  }, [location]);

  const openAuth = () => {
    dispatch(authActions.openAuthForm());
  };
  const closeAuth = () => {
    dispatch(authActions.closeAuthForm());
  };

  return (
    <div className={classes.wrapper}>
      <Header>
        <MobileNavigation />
        <div className={classes.logo}>Your recipe book</div>
        <MainNavigation />
        {isAuth && <UserNavigation />}
        {!isAuth && (
          <Buttton onClick={openAuth} className={classes["btn-auth"]}>
            Sign In
          </Buttton>
        )}
      </Header>

      <main>
        <ErrorBoundary key={locationPath}>
          <Outlet />
        </ErrorBoundary>
      </main>
      {authIsOpen && (
        <Modal onClose={closeAuth}>
          <AuthForm />
        </Modal>
      )}
    </div>
  );
};

export default Layout;
