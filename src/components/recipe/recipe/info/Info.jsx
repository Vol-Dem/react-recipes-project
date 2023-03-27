import classes from "./Info.module.scss";
import { ReactComponent as ClockIcon } from "./../../../../assets/clock.svg";
import { ReactComponent as ServingsIcon } from "./../../../../assets/servings.svg";

const Info = ({ readyInMinutes, servings }) => {
  return (
    <div className={classes["recipe__info"]}>
      <div className={classes["recipe__param"]}>
        <ClockIcon /> {readyInMinutes} min
      </div>
      <div className={classes["recipe__param"]}>
        <ServingsIcon /> {servings} servings
      </div>
    </div>
  );
};

export default Info;
