import classes from "./RecipeItem.module.scss";
import { ReactComponent as ClockIcon } from "./../../../assets/clock.svg";
import { ReactComponent as CaloriesIcon } from "./../../../assets/calories.svg";
import { useContext } from "react";
import RecipeContext from "../../../store/recipe-context";
import { ReactComponent as StarIcon } from "./../../../assets/star.svg";
import { useSelector } from "react-redux";

function RecipeItem({ recipe }) {
  const recipeCtx = useContext(RecipeContext);
  const recipeIsOpen = recipeCtx.recipeIsOpen;
  const recipeId = recipeCtx.recipeId;
  const openRecipe = recipeCtx.openRecipe;

  const isAuth = useSelector((state) => state.auth.isLoggedIn);
  const favList = useSelector((state) => state.fav.favList);
  const isFav = isAuth && favList.includes(recipe.id);

  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";

  const openRecipeHandler = (e) => {
    const recipeId = e.target.closest("#recipe-item")?.dataset.id;
    openRecipe(+recipeId);
  };

  return (
    <div
      id="recipe-item"
      data-id={recipe.id}
      className={`${classes["recipe-card"]} ${classSide} ${
        recipe.id === +recipeId ? classes.active : ""
      }`}
      onClick={openRecipeHandler}
    >
      <div className={classes["recipe-card__img"]}>
        {isFav && <StarIcon className={classes["recipe-card__img--fav"]} />}
        <img src={recipe.img} alt={recipe.title} />
      </div>
      <div className={classes["recipe-card__description"]}>
        <div className={classes["recipe-card__info"]}>
          <span className={classes["recipe-card__param"]}>
            <CaloriesIcon /> {recipe.calories.toFixed()} kcal
          </span>
          <span className={classes["recipe-card__param"]}>
            <ClockIcon /> {recipe.time} min
          </span>
        </div>
        <div className={classes["recipe-card__title"]}>
          <p>{recipe.title}</p>
        </div>
      </div>
      {!recipeIsOpen && (
        <a href="/" className={classes["recipe-card__btn"]}>
          Read More
        </a>
      )}
    </div>
  );
}

export default RecipeItem;
