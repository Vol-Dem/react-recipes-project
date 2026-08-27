import { Link } from "react-router-dom";
import Checkbox from "../ui/Checkbox";
import classes from "./AuthAgreement.module.scss";

const AuthAgreement = ({ checked, onChange }) => (
  <Checkbox
    id="agreement"
    name="agreement"
    label={
      <span>
        I have read and agree to the{" "}
        <Link className={classes.link} to="tos" target="blank">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link className={classes.link} to="privacy" target="blank">
          Privacy Policy
        </Link>
      </span>
    }
    checked={checked}
    onChange={onChange}
  />
);

export default AuthAgreement;
