import { Link } from "react-router-dom";
import Checkbox from "../../../../shared/components/ui/Checkbox/Checkbox";
import classes from "./AuthAgreement.module.scss";

const AuthAgreement = ({ checked, onChange }) => (
  <div className={classes.agreement}>
    <Checkbox
      id="agreement"
      name="agreement"
      aria-labelledby="agreement-description"
      checked={checked}
      onChange={onChange}
    />
    <span id="agreement-description">
      I have read and agree to the{" "}
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
    </span>
  </div>
);

export default AuthAgreement;
