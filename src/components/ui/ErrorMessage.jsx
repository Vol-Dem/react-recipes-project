import classes from "./ErrorMessage.module.scss";
import Card from "./Card";

const ErrorMessage = ({ message }) => {
  return (
    <Card>
      <div className={classes.error}>{message}</div>
    </Card>
  );
};

export default ErrorMessage;
