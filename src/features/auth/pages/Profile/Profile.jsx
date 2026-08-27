import Card from "../../../../shared/components/ui/Card/Card";
import classes from "./Profile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { changeUserName, changeUserPassword } from "../../store/authSlice";
import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import { useState } from "react";
import UserIcon from "../../../../assets/icons/user.svg?react";
import { motion } from "framer-motion";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../../../../shared/constants";
import EditableProfileField from "../../components/EditableProfileField/EditableProfileField";
import ProfileField from "../../components/ProfileField/ProfileField";

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
              <ProfileField label="Name">
                <EditableProfileField
                  displayValue={userData.userName}
                  inputName="name"
                  inputPlaceholder={userData.userName || ""}
                  inputType="text"
                  isEditing={changeNameIsActive}
                  onSubmit={changeNameHandler}
                  onToggle={changeNameIsActiveHandler}
                />
              </ProfileField>
              <ProfileField label="Email">{userData.email}</ProfileField>
              <ProfileField label="Password">
                <EditableProfileField
                  displayValue="********"
                  inputName="pass"
                  inputType="password"
                  isEditing={changePassIsActive}
                  onSubmit={changePasswordHandler}
                  onToggle={changePassIsActiveHandler}
                />
              </ProfileField>
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
