import Skeleton from "../Skeleton/Skeleton";
import classes from "./RecipeItemSkeleton.module.scss";
import ClockIcon from "../../../../../assets/icons/clock.svg?react";
import CaloriesIcon from "../../../../../assets/icons/calories.svg?react";
import { useParams } from "next/navigation";

const RecipeItemSkeleton = () => {
  const { recipeId } = useParams();
  const recipeIsOpen = recipeId;
  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";

  return (
    <li id="recipe-item" className={`${classes["recipe-card"]} ${classSide} `}>
      <div className={classes["recipe-card__img"]}>
        <Skeleton classNames="img" />
      </div>
      <div className={classes["recipe-card__description"]}>
        <div className={classes["recipe-card__info"]}>
          <span className={classes["recipe-card__param"]}>
            <CaloriesIcon aria-hidden="true" focusable="false" />{" "}
            <Skeleton classNames="text width-40" />
          </span>
          <span className={classes["recipe-card__param"]}>
            <ClockIcon aria-hidden="true" focusable="false" />{" "}
            <Skeleton classNames="text width-40" />
          </span>
        </div>
        <div>
          <Skeleton classNames="title" />
          <Skeleton classNames="title" />
          {!recipeIsOpen && <Skeleton classNames="btn" />}
        </div>
      </div>
    </li>
  );
};

export default RecipeItemSkeleton;
