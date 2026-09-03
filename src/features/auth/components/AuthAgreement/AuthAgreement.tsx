import Link from "next/link";
import Checkbox from "../../../../shared/components/ui/Checkbox/Checkbox";
import classes from "./AuthAgreement.module.scss";
import type { ChangeEventHandler } from "react";

interface AuthAgreementProps {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement> | (() => void);
}

const AuthAgreement = ({ checked, onChange }: AuthAgreementProps) => (
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
    </span>
  </div>
);

export default AuthAgreement;
