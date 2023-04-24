import classes from "./ErrorMessage.module.scss";

const ErrorMessage = (props) => {
  return (
    <div className={`${classes.error} ${props.className || ""}`}>
      {props.children}
    </div>
  );
};

export default ErrorMessage;
