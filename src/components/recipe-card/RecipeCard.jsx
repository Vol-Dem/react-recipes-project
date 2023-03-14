import classes from "./RecipeCard.module.css";
import { ReactComponent as ClockIcon } from "./../../assets/clock.svg";
import { ReactComponent as CaloriesIcon } from "./../../assets/calories.svg";
import { useContext } from "react";
import RecipeContext from "../../store/recipe-context";

function RecipeCard(props) {
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
          <img src={recipe.img} alt={recipe.title} className={classes.img} />
          <div className={classes["recipe-card__text"]}>
            <div className={classes["recipe-card__info"]}>
              <div className={classes["recipe-card__item"]}>
                <CaloriesIcon /> {recipe.calories.toFixed()} kcal
              </div>
              <div className={classes["recipe-card__item"]}>
                <ClockIcon /> {recipe.time} min
              </div>
            </div>
            <div className={classes.text}>
              <p className={classes["recipe-card__title"]}>{recipe.title}</p>
            </div>
          </div>
          {!recipeIsOpen && (
            <a href="/" className={classes["recipe-card__btn-more"]}>
              Read More
            </a>
          )}
        </div>
      ))}
    </>
  );
}

export default RecipeCard;
