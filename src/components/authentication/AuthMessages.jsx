import ErrorMessage from "../ui/ErrorMessage";
import SuccessMessage from "../ui/SuccessMessage";
import classes from "./AuthMessages.module.scss";

const AuthMessages = ({ errorMessage, successMessage }) => (
  <>
    {errorMessage && (
      <ErrorMessage className={classes["auth__error"]}>
        {errorMessage}
      </ErrorMessage>
    )}
    {successMessage && (
      <SuccessMessage className={classes["auth__error"]}>
        {successMessage}
      </SuccessMessage>
    )}
  </>
);

export default AuthMessages;
