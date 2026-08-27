import Button from "../../../../shared/components/ui/Button/Button";
import ButtonSecondary from "../../../../shared/components/ui/ButtonSecondary/ButtonSecondary";
import Spinner from "../../../../shared/components/ui/Spinner/Spinner";
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
