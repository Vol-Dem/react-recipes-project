import classes from "./ErrorMessage.module.scss";

const ErrorMessage = ({ children, className }) => {
  return (
    <div
      data-testid="error-message"
      className={`${classes.error} ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default ErrorMessage;
