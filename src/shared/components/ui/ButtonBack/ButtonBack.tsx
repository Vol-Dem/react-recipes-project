import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import classes from "./ButtonBack.module.scss";
import type { MouseEventHandler } from "react";

interface ButtonBackProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ButtonBack = ({ onClick }: ButtonBackProps) => {
  return (
    <button type="button" className={classes["btn-back"]} onClick={onClick}>
      <ArrowUturnLeftIcon aria-hidden="true" focusable="false" /> Back
    </button>
  );
};

export default ButtonBack;
