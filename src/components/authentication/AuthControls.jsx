import Button from "../ui/Button";
import ButtonSecondary from "../ui/ButtonSecondary";
import Spinner from "../ui/Spinner";
import classes from "./AuthControls.module.scss";

const AuthControls = ({ isLoading, isLogin, onSwitch }) => (
  <div className={classes["auth__controls"]}>
    <ButtonSecondary
      type="button"
      disabled={isLoading}
      className={classes["auth__btn--switch"]}
      onClick={onSwitch}
    >
      {isLogin ? "Create Account" : "Log in"}
    </ButtonSecondary>
    <Button disabled={isLoading} className={classes["auth__btn--submit"]}>
      {isLoading && <Spinner size="small" />}
      <span>{isLogin ? "Log in" : "Sign up"}</span>
    </Button>
  </div>
);

export default AuthControls;
