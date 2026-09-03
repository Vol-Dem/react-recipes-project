import classes from "./ErrorMessage.module.scss";
import type { PropsWithChildren } from "react";

interface ErrorMessageProps extends PropsWithChildren {
  className?: string;
}

const ErrorMessage = ({ children, className }: ErrorMessageProps) => {
  return (
    <div
      role="alert"
      data-testid="error-message"
      className={`${classes.error} ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default ErrorMessage;
