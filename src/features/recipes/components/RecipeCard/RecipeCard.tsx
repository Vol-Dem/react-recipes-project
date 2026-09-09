import classes from "./RecipeCard.module.scss";
import ClockIcon from "../../../../assets/icons/clock.svg?react";
import CaloriesIcon from "../../../../assets/icons/calories.svg?react";
import StarIcon from "../../../../assets/icons/star.svg?react";
import FoodIcon from "../../../../assets/icons/food.svg?react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRecipeList } from "../../context/RecipeListContext";
import { buildRecipeDetailsHref } from "../../utils/recipeNavigation";
import { motion } from "framer-motion";
import Image from "../../../../shared/components/ui/Image/Image";
import {
  RECIPE_CARD_HOVER_ANIMATION,
  RECIPE_CARD_INITIAL_ANIMATION,
  RECIPE_CARD_VARIANTS,
} from "../../constants/animations";
import { selectAuthIsLoggedIn } from "../../../auth/store/authSelectors";
import { useFavorites } from "../../../favorites/context/FavoritesContext";
import type { RecipeSummary } from "../../types";
import {
  RECIPE_CARD_IMAGE_HEIGHT,
  RECIPE_CARD_IMAGE_SIZES,
  RECIPE_CARD_IMAGE_WIDTH,
  RECIPE_SIDEBAR_IMAGE_SIZES,
} from "../../constants/images";

interface RecipeCardProps {
  recipe: RecipeSummary;
  shouldPrefetch: boolean;
}

const RecipeCard = ({ recipe, shouldPrefetch }: RecipeCardProps) => {
  const { recipeId } = useParams<{ recipeId?: string }>() ?? {};
  const { listHref } = useRecipeList();
  const recipeIsOpen = !!recipeId;
  const isAuth = useSelector(selectAuthIsLoggedIn);
  const { favoriteIds } = useFavorites();
  const isFavorite = favoriteIds.includes(recipe.id);
  const isFav = isAuth && isFavorite;
  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";
  const isActive = recipe.id === Number(recipeId);
  const cardClassName = `${classes["recipe-card"]} ${classSide} ${
    isActive ? classes.active : ""
  }`;

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
        href={buildRecipeDetailsHref(recipe.id, listHref)}
        prefetch={shouldPrefetch ? null : false}
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
            width={RECIPE_CARD_IMAGE_WIDTH}
            height={RECIPE_CARD_IMAGE_HEIGHT}
            sizes={
              recipeIsOpen
                ? RECIPE_SIDEBAR_IMAGE_SIZES
                : RECIPE_CARD_IMAGE_SIZES
            }
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
