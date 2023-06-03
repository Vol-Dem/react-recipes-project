import classes from "./RecipeItem.module.scss";
import { ReactComponent as ClockIcon } from "./../../../assets/clock.svg";
import { ReactComponent as CaloriesIcon } from "./../../../assets/calories.svg";
import { useState } from "react";
import { ReactComponent as StarIcon } from "./../../../assets/star.svg";
import { ReactComponent as FoodIcon } from "./../../../assets/food.svg";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const RecipeItem = ({ recipe }) => {
  const [imgIsLoading, setImgIsLoading] = useState(true);
  const { recipeId } = useParams();
  const recipeIsOpen = !!recipeId;
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const favList = useSelector((state) => state.fav.favList);
  const isFav = isAuth && favList.includes(recipe.id);
  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";

  const openRecipeHandler = (e) => {
    navigate(`recipe/${recipe.id}`);
  };

  const imgloadingHandler = () => {
    setImgIsLoading(false);
  };

  return (
    <div
      className={`${classes["recipe-card"]} ${classSide} ${
        recipe.id === +recipeId ? classes.active : ""
      }`}
      onClick={openRecipeHandler}
    >
      <div className={classes["recipe-card__img-container"]}>
        {isFav && (
          <StarIcon className={classes["recipe-card__img-container--fav"]} />
        )}
        <img
          className={`${classes["recipe-card__img"]} ${
            imgIsLoading ? classes["recipe-card__img--hidden"] : ""
          }`}
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
        <div href="/" className={classes["recipe-card__btn"]}>
          Read More
        </div>
      )}
    </div>
  );
};

export default RecipeItem;
