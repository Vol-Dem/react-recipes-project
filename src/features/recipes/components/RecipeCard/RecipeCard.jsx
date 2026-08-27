import classes from "./RecipeCard.module.scss";
import ClockIcon from "../../../../assets/icons/clock.svg?react";
import CaloriesIcon from "../../../../assets/icons/calories.svg?react";
import { useState } from "react";
import StarIcon from "../../../../assets/icons/star.svg?react";
import FoodIcon from "../../../../assets/icons/food.svg?react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const RecipeCard = ({ recipe }) => {
  const [imgIsLoading, setImgIsLoading] = useState(true);
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const favList = useSelector((state) => state.fav.favList);
  const isFav = isAuth && favList.includes(recipe.id);
  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";
  const isActive = recipe.id === +recipeId;
  const cardClassName = `${classes["recipe-card"]} ${classSide} ${
    isActive ? classes.active : ""
  }`;
  const imageClassName = `${classes["recipe-card__img"]} ${
    imgIsLoading ? classes["recipe-card__img--hidden"] : ""
  }`;

  const imgloadingHandler = () => {
    setImgIsLoading(false);
  };

  return (
    <motion.li
      key={recipe.id}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      variants={{
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { type: "spring" },
        },
      }}
      animate="visible"
      whileHover={{ scale: 1.04, transition: { type: "tween" } }}
      className={cardClassName}
    >
      <Link
        to={`recipe/${recipe.id}`}
        className={classes["recipe-card__link"]}
      >
        <div className={classes["recipe-card__img-container"]}>
          {isFav && (
            <StarIcon className={classes["recipe-card__img-container--fav"]} />
          )}
          <img
            className={imageClassName}
            src={recipe.img}
            alt={recipe.title}
            onLoad={imgloadingHandler}
          />
          {imgIsLoading && <FoodIcon className={classes["food"]} />}
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
