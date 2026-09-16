import { CheckCircleIcon } from "@heroicons/react/24/outline";
import classes from "./SuccessMessage.module.scss";
import type { PropsWithChildren } from "react";

interface SuccessMessageProps extends PropsWithChildren {
  className?: string;
}

const SuccessMessage = ({ children, className }: SuccessMessageProps) => {
  return (
    <div role="status" className={`${classes["success"]} ${className || ""}`}>
      <CheckCircleIcon aria-hidden="true" focusable="false" />
      <span>{children}</span>
    </div>
  );
};

export default SuccessMessage;
