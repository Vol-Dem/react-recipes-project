import { useContext } from "react";
import classes from "./ErrorMessage.module.css";
import ErrorContext from "../../store/error-context";

const ErrorMessage = () => {
  const errorCtx = useContext(ErrorContext);
  const message = errorCtx.errorMessage;

  return <div className={classes.error}>{message}</div>;
};

export default ErrorMessage;
