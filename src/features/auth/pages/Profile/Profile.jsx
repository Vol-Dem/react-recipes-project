import Card from "../../../../shared/components/ui/Card/Card";
import classes from "./Profile.module.scss";
import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import UserIcon from "../../../../assets/icons/user.svg?react";
import { motion } from "framer-motion";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../../../../shared/constants";
import EditableProfileField from "../../components/EditableProfileField/EditableProfileField";
import ProfileField from "../../components/ProfileField/ProfileField";
import { useProfileController } from "../../hooks/useProfileController";
import { usePageSetup } from "../../../../shared/hooks/usePageSetup";

const Profile = ({ title }) => {
  usePageSetup(title);

  const { actions, editing, status, user } = useProfileController();

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
                  displayValue={user.userName}
                  inputName="name"
                  inputPlaceholder={user.userName || ""}
                  inputType="text"
                  isEditing={editing.name}
                  onSubmit={actions.submitName}
                  onToggle={actions.toggleNameEditing}
                />
              </ProfileField>
              <ProfileField label="Email">{user.email}</ProfileField>
              <ProfileField label="Password">
                <EditableProfileField
                  displayValue="********"
                  inputName="pass"
                  inputType="password"
                  isEditing={editing.password}
                  onSubmit={actions.submitPassword}
                  onToggle={actions.togglePasswordEditing}
                />
              </ProfileField>
            </dl>
            {status.errorMessage && (
              <ErrorMessage>{status.errorMessage}</ErrorMessage>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Profile;
