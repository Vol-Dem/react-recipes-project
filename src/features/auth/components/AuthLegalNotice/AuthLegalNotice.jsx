import Link from "next/link";
import classes from "./AuthLegalNotice.module.scss";

const AuthLegalNotice = () => (
  <div className={classes.privacy}>
    By continuing, you are indicating that you accept our
    <Link
      className={classes.link}
      href="/tos"
      target="_blank"
      rel="noopener noreferrer"
    >
      Terms of Service
    </Link>{" "}
    and{" "}
    <Link
      className={classes.link}
      href="/privacy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Privacy Policy
    </Link>
  </div>
);

export default AuthLegalNotice;
