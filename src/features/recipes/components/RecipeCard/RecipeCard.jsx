import classes from "./RecipeCard.module.scss";
import ClockIcon from "../../../../assets/icons/clock.svg?react";
import CaloriesIcon from "../../../../assets/icons/calories.svg?react";
import StarIcon from "../../../../assets/icons/star.svg?react";
import FoodIcon from "../../../../assets/icons/food.svg?react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Image from "../../../../shared/components/ui/Image/Image";
import {
  RECIPE_CARD_HOVER_ANIMATION,
  RECIPE_CARD_INITIAL_ANIMATION,
  RECIPE_CARD_VARIANTS,
} from "../../constants/animations";
import { selectAuthIsLoggedIn } from "../../../auth/store/authSelectors";
import { selectIsFavorite } from "../../../favorites/store/favoritesSelectors";

const RecipeCard = ({ recipe }) => {
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const isAuth = useSelector(selectAuthIsLoggedIn);
  const isFavorite = useSelector((state) => selectIsFavorite(state, recipe.id));
  const isFav = isAuth && isFavorite;
  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";
  const isActive = recipe.id === +recipeId;
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
      <Link to={`recipe/${recipe.id}`} className={classes["recipe-card__link"]}>
        <div className={classes["recipe-card__img-container"]}>
          {isFav && (
            <StarIcon className={classes["recipe-card__img-container--fav"]} />
          )}
          <Image
            className={classes["recipe-card__img"]}
            src={recipe.img}
            alt={recipe.title}
            fallback={<FoodIcon className={classes.food} />}
          />
        </div>
        <div className={classes["recipe-card__description"]}>
          <div className={classes["recipe-card__info"]}>
            <span className={classes["recipe-card__param"]}>
              <CaloriesIcon /> {recipe.calories.toFixed()} kcal
            </span>
            <span className={classes["recipe-card__param"]}>
              <ClockIcon /> {recipe.readyInMinutes} min
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
