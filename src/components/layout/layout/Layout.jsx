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
import { Suspense } from "react";
import Spinner from "../../ui/Spinner";
import Notification from "../../ui/Notification";

const Layout = () => {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const authIsOpen = useSelector((state) => state.auth.authFormIsOpen);
  const notificationIsShown = useSelector(
    (state) => state.notification.isShown
  );
  const notificationTitle = useSelector((state) => state.notification.title);
  const notificationMessage = useSelector(
    (state) => state.notification.message
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
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
      {authIsOpen && (
        <Modal onClose={closeAuth}>
          <AuthForm />
        </Modal>
      )}
      {notificationIsShown && (
        <Notification title={notificationTitle} message={notificationMessage} />
      )}
    </div>
  );
};

export default Layout;
