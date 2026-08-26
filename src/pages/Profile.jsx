import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import classes from "./Profile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { changeUserName, changeUserPassword } from "../store/auth";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useState } from "react";
import ButtonSecondary from "../components/ui/ButtonSecondary";
import UserIcon from "./../assets/user.svg?react";
import { motion } from "framer-motion";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../constants";

const Profile = () => {
  const [changeNameIsActive, setChangeNameIsActive] = useState(false);
  const [changePassIsActive, setChangePassIsActive] = useState(false);
  const dispatch = useDispatch();
  const errorMessageAuth = useSelector((state) => state.auth.errorMessage);
  const userData = useSelector((state) => state.auth.user);

  // Toggle the change-name form.
  const changeNameIsActiveHandler = () => {
    setChangeNameIsActive((prevState) => !prevState);
  };

  // Toggle the change-password form.
  const changePassIsActiveHandler = () => {
    setChangePassIsActive((prevState) => !prevState);
  };

  // Retrieve the new password and dispatch the changeUserPassword action.
  const changePasswordHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("pass");
    dispatch(changeUserPassword(password));
  };

  // Retrieve the new name and dispatch the changeUserName action.
  const changeNameHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    dispatch(changeUserName(name));
    setChangeNameIsActive(false);
  };

  const nameForm = (
    <form onSubmit={changeNameHandler} className={classes["profile__form"]}>
      {!changeNameIsActive && <span>{userData.userName}</span>}
      {changeNameIsActive && (
        <>
          <Input
            type="text"
            name="name"
            placeholder={`${userData.userName || ""}`}
            autoFocus={true}
          />
          <ButtonSecondary>Submit</ButtonSecondary>
        </>
      )}
      <ButtonSecondary type="button" onClick={changeNameIsActiveHandler}>
        {!changeNameIsActive ? "Change" : "Cancel"}
      </ButtonSecondary>
    </form>
  );

  const passForm = (
    <form onSubmit={changePasswordHandler} className={classes["profile__form"]}>
      {!changePassIsActive && <span>********</span>}
      {changePassIsActive && (
        <>
          <Input type="password" name="pass" autoFocus={true} />
          <ButtonSecondary>Submit</ButtonSecondary>
        </>
      )}
      <ButtonSecondary type="button" onClick={changePassIsActiveHandler}>
        {!changePassIsActive ? "Change" : "Cancel"}
      </ButtonSecondary>
    </form>
  );

  return (
    <motion.div
      initial={ANIMATION_SLIDE_IN_INITIAL}
      animate={ANIMATION_SLIDE_IN}
    >
      <Card>
        <div className={classes["profile__container"]}>
          <div className={classes["profile__img"]}>
            <UserIcon />
          </div>
          <div>
            <h1 className={classes["profile__title"]}>Profile</h1>
            <dl className={classes["profile__info"]}>
              <div className={classes["profile__element"]}>
                <dt>Name:</dt>
                <dd>{nameForm}</dd>
              </div>
              <div className={classes["profile__element"]}>
                <dt>Email:</dt>
                <dd>{userData.email}</dd>
              </div>
              <div className={classes["profile__element"]}>
                <dt>Password:</dt>
                <dd>{passForm}</dd>
              </div>
            </dl>
            {errorMessageAuth && (
              <ErrorMessage>{errorMessageAuth}</ErrorMessage>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Profile;
