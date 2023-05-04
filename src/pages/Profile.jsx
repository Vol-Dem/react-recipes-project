import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import classes from "./Profile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { changeUserName, changeUserPassword } from "../store/auth";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useState } from "react";
import ButttonSecondary from "../components/ui/ButtonSecondary";
import { ReactComponent as UserIcon } from "./../assets/user.svg";

const Profile = () => {
  const [changeNameIsActive, setChangeNameIsActive] = useState(false);
  const [changePassIsActive, setChangePassIsActive] = useState(false);
  const dispatch = useDispatch();
  const errorMessageAuth = useSelector((state) => state.auth.errorMessage);
  const userData = useSelector((state) => state.auth.user);

  const changeNameIsActiveHandler = () => {
    setChangeNameIsActive((prevState) => !prevState);
  };

  const changePassIsActiveHandler = () => {
    setChangePassIsActive((prevState) => !prevState);
  };

  const changePasswordHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("pass");
    dispatch(changeUserPassword(password));
  };

  const changeNameHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    dispatch(changeUserName(name));
    setChangeNameIsActive(false);
  };

  const nameForm = (
    <form onSubmit={changeNameHandler} className={classes["profile__form"]}>
      <div>Name: {!changeNameIsActive && <span>{userData.userName}</span>}</div>
      {changeNameIsActive && (
        <>
          <Input
            input={{
              type: "text",
              name: "name",
              placeholder: `${userData.userName || ""}`,
            }}
            autoFocus={true}
          />
          <ButttonSecondary>Submit</ButttonSecondary>
        </>
      )}
      <ButttonSecondary type="button" onClick={changeNameIsActiveHandler}>
        {!changeNameIsActive ? "Change" : "Cancel"}
      </ButttonSecondary>
    </form>
  );

  const passForm = (
    <form onSubmit={changePasswordHandler} className={classes["profile__form"]}>
      <div>Password: {!changePassIsActive && <span>********</span>}</div>
      {changePassIsActive && (
        <>
          <Input input={{ type: "password", name: "pass" }} autoFocus={true} />
          <ButttonSecondary>Submit</ButttonSecondary>
        </>
      )}
      <ButttonSecondary type="button" onClick={changePassIsActiveHandler}>
        {!changePassIsActive ? "Change" : "Cancel"}
      </ButttonSecondary>
    </form>
  );

  return (
    <section className={classes.profile}>
      <Card>
        <div className={classes["profile__container"]}>
          <div className={classes["profile__img"]}>
            <UserIcon />
          </div>
          <div>
            <h1 className={classes["profile__title"]}>Profile</h1>
            <div className={classes["profile__info"]}>
              <div className={classes["profile__element"]}>{nameForm}</div>
              <div className={classes["profile__element"]}>
                <div>Email: {userData.email}</div>
              </div>
              <div className={classes["profile__element"]}>{passForm}</div>

              {errorMessageAuth && (
                <ErrorMessage className={classes["auth__error"]}>
                  {errorMessageAuth}
                </ErrorMessage>
              )}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Profile;
