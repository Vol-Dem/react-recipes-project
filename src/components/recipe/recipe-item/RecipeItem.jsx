import classes from "./RecipeItem.module.scss";
import { ReactComponent as ClockIcon } from "./../../../assets/clock.svg";
import { ReactComponent as CaloriesIcon } from "./../../../assets/calories.svg";
import { useContext } from "react";
import RecipeContext from "../../../store/recipe-context";

function RecipeItem(props) {
  const recipeInfo = props.data;

  const recipeCtx = useContext(RecipeContext);
  const recipeIsOpen = recipeCtx.recipeIsOpen;
  const recipeId = recipeCtx.recipeId;
  const openRecipe = recipeCtx.setRecipeIsOpenHandler;

  const classSide = recipeIsOpen ? classes["recipe-card--side"] : "";

  const openRecipeHandler = (e) => {
    const recipeId = e.target.closest("#recipe")?.dataset.id;
    openRecipe(+recipeId);
  };

  return (
    <>
      {recipeInfo.map((recipe) => (
        <div
          key={recipe.id}
          id="recipe"
          data-id={recipe.id}
          className={`${classes["recipe-card"]} ${classSide} ${
            recipe.id === +recipeId ? classes.active : ""
          }`}
          onClick={openRecipeHandler}
        >
          <img
            src={recipe.img}
            alt={recipe.title}
            className={classes["recipe-card__img"]}
          />
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
      ))}
    </>
  );
}

export default RecipeItem;
