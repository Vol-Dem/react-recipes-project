import classes from "./ButtonBack.module.scss";
import { ReactComponent as ArrowBackIcon } from "./../../assets/arrow-back.svg";

const ButtonBack = ({ onClick }) => {
  return (
    <button className={classes["recipe__btn-back"]} onClick={onClick}>
      <ArrowBackIcon /> Back
    </button>
  );
};

export default ButtonBack;
