import { ClockIcon, FireIcon } from "@heroicons/react/24/outline";
import Skeleton from "../Skeleton/Skeleton";
import classes from "./RecipeItemSkeleton.module.scss";
import { useParams } from "next/navigation";
import {
  RECIPE_CARD_IMAGE_WIDTH,
  RECIPE_CARD_IMAGE_HEIGHT,
} from "../../../constants/images";

const RecipeItemSkeleton = () => {
  const { recipeId } = useParams<{ recipeId?: string }>() ?? {};
  const recipeIsOpen = recipeId;
  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";

  return (
    <li aria-hidden="true" className={`${classes["recipe-card"]} ${classSide}`}>
      <div
        className={classes["recipe-card__img"]}
        style={{
          aspectRatio: `${RECIPE_CARD_IMAGE_WIDTH} / ${RECIPE_CARD_IMAGE_HEIGHT}`,
        }}
      >
        <Skeleton classNames="img" />
      </div>
      <div className={classes["recipe-card__description"]}>
        <div className={classes["recipe-card__info"]}>
          <span className={classes["recipe-card__param"]}>
            <FireIcon aria-hidden="true" focusable="false" />{" "}
            <Skeleton classNames="text width-40" />
          </span>
          <span className={classes["recipe-card__param"]}>
            <ClockIcon aria-hidden="true" focusable="false" />{" "}
            <Skeleton classNames="text width-40" />
          </span>
        </div>
        <div className={classes["recipe-card__title"]}>
          <Skeleton classNames="title" />
          <Skeleton classNames="title" />
        </div>
      </div>
      {!recipeIsOpen && (
        <div className={classes["recipe-card__btn"]}>
          <Skeleton classNames="btn" />
        </div>
      )}
    </li>
  );
};

export default RecipeItemSkeleton;
