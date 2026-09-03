import classes from "./RecipeCard.module.scss";
import ClockIcon from "../../../../assets/icons/clock.svg?react";
import CaloriesIcon from "../../../../assets/icons/calories.svg?react";
import StarIcon from "../../../../assets/icons/star.svg?react";
import FoodIcon from "../../../../assets/icons/food.svg?react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "../../../../shared/components/ui/Image/Image";
import {
  RECIPE_CARD_HOVER_ANIMATION,
  RECIPE_CARD_INITIAL_ANIMATION,
  RECIPE_CARD_VARIANTS,
} from "../../constants/animations";
import { selectAuthIsLoggedIn } from "../../../auth/store/authSelectors";
import { selectIsFavorite } from "../../../favorites/store/favoritesSelectors";
import type { RootState } from "../../../../app/store";
import type { RecipeSummary } from "../../types";

const RecipeCard = ({ recipe }: { recipe: RecipeSummary }) => {
  const { recipeId } = useParams<{ recipeId?: string }>() ?? {};
  const pathname = usePathname() ?? "";
  const recipeIsOpen = !!recipeId;
  const isAuth = useSelector(selectAuthIsLoggedIn);
  const isFavorite = useSelector((state: RootState) =>
    selectIsFavorite(state, recipe.id),
  );
  const isFav = isAuth && isFavorite;
  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";
  const isActive = recipe.id === Number(recipeId);
  const cardClassName = `${classes["recipe-card"]} ${classSide} ${
    isActive ? classes.active : ""
  }`;
  const recipeBasePath = pathname.startsWith("/favorites")
    ? "/favorites/recipe"
    : "/recipe";

  return (
    <motion.li
      key={recipe.id}
      layout
      initial={RECIPE_CARD_INITIAL_ANIMATION}
      variants={RECIPE_CARD_VARIANTS}
      animate="visible"
      whileHover={RECIPE_CARD_HOVER_ANIMATION}
      className={cardClassName}
    >
      <Link
        href={`${recipeBasePath}/${recipe.id}`}
        className={classes["recipe-card__link"]}
      >
        <div className={classes["recipe-card__img-container"]}>
          {isFav && (
            <StarIcon
              className={classes["recipe-card__img-container--fav"]}
              aria-hidden="true"
              focusable="false"
            />
          )}
          <Image
            className={classes["recipe-card__img"]}
            src={recipe.img}
            alt={recipe.title}
            fallback={
              <FoodIcon
                className={classes.food}
                aria-hidden="true"
                focusable="false"
              />
            }
          />
        </div>
        <div className={classes["recipe-card__description"]}>
          <div className={classes["recipe-card__info"]}>
            <span className={classes["recipe-card__param"]}>
              <CaloriesIcon aria-hidden="true" focusable="false" />{" "}
              {recipe.calories.toFixed()} kcal
            </span>
            <span className={classes["recipe-card__param"]}>
              <ClockIcon aria-hidden="true" focusable="false" />{" "}
              {recipe.readyInMinutes} min
            </span>
          </div>
          <div className={classes["recipe-card__title"]}>
            <p>{recipe.title}</p>
          </div>
        </div>
        {!recipeIsOpen && (
          <span className={classes["recipe-card__btn"]}>Read More</span>
        )}
      </Link>
    </motion.li>
  );
};

export default RecipeCard;
