import classes from "./ButtonBack.module.scss";
import ArrowBackIcon from "../../../../assets/icons/arrow-back.svg?react";
import type { MouseEventHandler } from "react";

interface ButtonBackProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ButtonBack = ({ onClick }: ButtonBackProps) => {
  return (
    <button type="button" className={classes["btn-back"]} onClick={onClick}>
      <ArrowBackIcon aria-hidden="true" focusable="false" /> Back
    </button>
  );
};

export default ButtonBack;
