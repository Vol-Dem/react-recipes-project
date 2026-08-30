import classes from "./ButtonBack.module.scss";
import ArrowBackIcon from "../../../../assets/icons/arrow-back.svg?react";

const ButtonBack = ({ onClick }) => {
  return (
    <button type="button" className={classes["btn-back"]} onClick={onClick}>
      <ArrowBackIcon aria-hidden="true" focusable="false" /> Back
    </button>
  );
};

export default ButtonBack;
