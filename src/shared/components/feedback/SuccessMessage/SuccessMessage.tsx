import classes from "./SuccessMessage.module.scss";
import SuccessIcon from "../../../../assets/icons/SuccessIcon";
import type { PropsWithChildren } from "react";

interface SuccessMessageProps extends PropsWithChildren {
  className?: string;
}

const SuccessMessage = ({ children, className }: SuccessMessageProps) => {
  return (
    <div role="status" className={`${classes["success"]} ${className || ""}`}>
      <SuccessIcon />
      <span>{children}</span>
    </div>
  );
};

export default SuccessMessage;
