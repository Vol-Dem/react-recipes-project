import classes from "./ButtonBack.module.scss";
import ArrowBackIcon from "./../../assets/arrow-back.svg?react";

const ButtonBack = ({ onClick }) => {
  return (
    <button className={classes["btn-back"]} onClick={onClick}>
      <ArrowBackIcon /> Back
    </button>
  );
};

export default ButtonBack;
