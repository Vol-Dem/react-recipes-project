import classes from "./UserNavigation.module.scss";
import UserIcon from "../../../../assets/icons/user.svg?react";
import ButtonSecondary from "../../../../shared/components/ui/ButtonSecondary/ButtonSecondary";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../../features/auth/store/authSlice";

const UserNavigation = () => {
  const email = useSelector((state) => state.auth.user.email);
  const userName =
    useSelector((state) => state.auth.user.userName) || email.split("@")[0];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(authActions.logout());
    navigate("/", { replace: true });
  };

  return (
    <div className={classes["nav-profile"]}>
        <div className={classes["nav-profile__user"]}>
          <span className={classes["nav-profile__name"]}>{userName}</span>
          <UserIcon />
        </div>
        <div className={classes["nav-profile__menu"]}>
          <ul className={classes["nav-profile__links"]}>
            <li className={classes["nav-profile__link"]}>
              <NavLink to="profile">Profile</NavLink>
            </li>
            <li className={classes["nav-profile__link"]}>
              <NavLink to="favorites">Favorites</NavLink>
            </li>
          </ul>
          <ButtonSecondary onClick={logout}>
            Logout
          </ButtonSecondary>
        </div>
    </div>
  );
};

export default UserNavigation;
