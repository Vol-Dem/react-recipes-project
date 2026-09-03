import ErrorMessage from "../../../../shared/components/feedback/ErrorMessage/ErrorMessage";
import SuccessMessage from "../../../../shared/components/feedback/SuccessMessage/SuccessMessage";
import classes from "./AuthMessages.module.scss";

interface AuthMessagesProps {
  errorMessage?: string;
  successMessage?: string;
}

const AuthMessages = ({ errorMessage, successMessage }: AuthMessagesProps) => (
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
