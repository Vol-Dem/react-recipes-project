import classes from "./ProfileField.module.scss";
import type { PropsWithChildren } from "react";

interface ProfileFieldProps extends PropsWithChildren {
  label: string;
}

const ProfileField = ({ children, label }: ProfileFieldProps) => (
  <div className={classes["profile__element"]}>
    <dt>{label}:</dt>
    <dd>{children}</dd>
  </div>
);

export default ProfileField;
