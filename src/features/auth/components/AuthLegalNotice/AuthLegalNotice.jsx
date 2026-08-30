import { Link } from "react-router-dom";
import classes from "./AuthLegalNotice.module.scss";

const AuthLegalNotice = () => (
  <div className={classes.privacy}>
    By continuing, you are indicating that you accept our
    <Link
      className={classes.link}
      to="/tos"
      target="_blank"
      rel="noopener noreferrer"
    >
      Terms of Service
    </Link>{" "}
    and{" "}
    <Link
      className={classes.link}
      to="/privacy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Privacy Policy
    </Link>
  </div>
);

export default AuthLegalNotice;
