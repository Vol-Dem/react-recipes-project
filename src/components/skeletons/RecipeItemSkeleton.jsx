import React from "react";
import Skeleton from "./Skeleton";
import classes from "./RecipeItemSkeleton.module.scss";
import { useContext } from "react";
import RecipeContext from "../../store/recipe-context";
import { ReactComponent as ClockIcon } from "./../../assets/clock.svg";
import { ReactComponent as CaloriesIcon } from "./../../assets/calories.svg";

const RecipeItemSkeleton = () => {
  const recipeCtx = useContext(RecipeContext);
  const recipeIsOpen = recipeCtx.recipeIsOpen;
  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";
  return (
    <div id="recipe-item" className={`${classes["recipe-card"]} ${classSide} `}>
      <div className={classes["recipe-card__img"]}>
        <Skeleton classNames="img" />
      </div>
      <div className={classes["recipe-card__description"]}>
        <div className={classes["recipe-card__info"]}>
          <span className={classes["recipe-card__param"]}>
            <CaloriesIcon /> <Skeleton classNames="text width-40" />
          </span>
          <span className={classes["recipe-card__param"]}>
            <ClockIcon /> <Skeleton classNames="text width-40" />
          </span>
        </div>
        <div className={classes["recipe-card__title"]}>
          <Skeleton classNames="title" />
          <Skeleton classNames="title" />
          {!recipeIsOpen && <Skeleton classNames="btn" />}
        </div>
      </div>
    </div>
  );
};

export default RecipeItemSkeleton;
