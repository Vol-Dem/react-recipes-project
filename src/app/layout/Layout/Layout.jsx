import Header from "../Header/Header";
import classes from "./Layout.module.scss";
import MainNavigation from "../Navigation/MainNavigation/MainNavigation";
import { Link, Outlet } from "react-router-dom";
import MobileNavigation from "../Navigation/MobileNavigation/MobileNavigation";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../features/auth/store/authSlice";
import UserNavigation from "../Navigation/UserNavigation/UserNavigation";
import Button from "../../../shared/components/ui/Button/Button";
import Modal from "../../../shared/components/ui/Modal/Modal";
import AuthForm from "../../../features/auth/components/AuthForm/AuthForm";
import { Suspense } from "react";
import Spinner from "../../../shared/components/ui/Spinner/Spinner";
import Notification from "../../../features/notifications/components/Notification/Notification";
import { AnimatePresence, motion } from "framer-motion";

const Layout = () => {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const authIsOpen = useSelector((state) => state.auth.authFormIsOpen);
  const notificationIsShown = useSelector(
    (state) => state.notification.isShown,
  );
  const notificationTitle = useSelector((state) => state.notification.title);
  const notificationMessage = useSelector(
    (state) => state.notification.message,
  );
  const dispatch = useDispatch();

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
        <Link to="/" className={classes.logo}>
          Your recipe book
        </Link>
        <MainNavigation />
        {isAuth && <UserNavigation />}
        {!isAuth && (
          <Button onClick={openAuth} className={classes["btn-auth"]}>
            Sign In
          </Button>
        )}
      </Header>

      <main>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
      <AnimatePresence>
        {authIsOpen && (
          <Modal onClose={closeAuth}>
            <AuthForm />
          </Modal>
        )}
        {notificationIsShown && (
          <Notification
            title={notificationTitle}
            message={notificationMessage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
