import { Link } from "react-router-dom";
import classes from "./AuthLegalNotice.module.scss";

const AuthLegalNotice = () => (
  <div className={classes.privacy}>
    By continuing, you are indicating that you accept our
    <Link className={classes.link} to="tos" target="blank">
      Terms of Service
    </Link>{" "}
    and{" "}
    <Link className={classes.link} to="privacy" target="blank">
      Privacy Policy
    </Link>
  </div>
);

export default AuthLegalNotice;
