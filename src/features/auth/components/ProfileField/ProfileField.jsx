import classes from "./ProfileField.module.scss";

const ProfileField = ({ children, label }) => (
  <div className={classes["profile__element"]}>
    <dt>{label}:</dt>
    <dd>{children}</dd>
  </div>
);

export default ProfileField;
