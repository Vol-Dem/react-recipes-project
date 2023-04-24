import { NavLink, useNavigate } from "react-router-dom";
import classes from "./MainNavigation.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/auth";
import AuthForm from "../../Auth/AuthForm";
import Modal from "../../ui/Modal";
import Buttton from "../../ui/Button";
import { ReactComponent as UserIcon } from "./../../../assets/user.svg";
import ButttonSecondary from "../../ui/ButtonSecondary";

function MainNavigation() {
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const authIsOpen = useSelector((state) => state.auth.authFormIsOpen);
  const email = useSelector((state) => state.auth.user.email);
  const userName =
    useSelector((state) => state.auth.user.userName) || email.split("@")[0];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openAuth = () => {
    dispatch(authActions.openAuthForm());
  };
  const closeAuth = () => {
    dispatch(authActions.closeAuthForm());
  };

  const logout = () => {
    dispatch(authActions.logout());
    navigate("/", { replace: true });
  };

  return (
    <>
      <nav className={classes.nav}>
        <ul className={classes["nav__links"]}>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="about">About</NavLink>
          </li>
          {isAuth && (
            <li>
              <NavLink to="profile">Profile</NavLink>
            </li>
          )}
          {isAuth && (
            <li>
              <div className={classes["nav__profile"]}>
                <div className={classes["nav__profile--user"]}>
                  <NavLink to="profile">
                    <div>{userName}</div> <UserIcon />
                  </NavLink>
                </div>
                <div className={classes["nav__profile--menu"]}>
                  <NavLink to="profile">Favorites</NavLink>
                  <NavLink to="profile">Profile</NavLink>
                  <ButttonSecondary
                    onClick={logout}
                    className={classes["nav__btn-auth"]}
                  >
                    Logout
                  </ButttonSecondary>
                </div>
              </div>
            </li>
          )}
        </ul>
        {!isAuth && (
          <Buttton onClick={openAuth} className={classes["nav__btn-auth"]}>
            Sign In
          </Buttton>
        )}
      </nav>
      {authIsOpen && (
        <Modal onClose={closeAuth}>
          <AuthForm />
        </Modal>
      )}
    </>
  );
}

export default MainNavigation;
