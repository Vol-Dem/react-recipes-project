import classes from "./RecipeCard.module.css";

function RecipeCard(props) {
  const recipeInfo = props.data;
  console.log(props.data);
  return (
    <>
      {recipeInfo.map((recipe) => (
        <div key={recipe.id} className={classes["recipe-card"]}>
          <img src={recipe.img} alt={recipe.title} className={classes.img} />
          <div className={classes["recipe-card__text"]}>
            <div className={classes["recipe-card__info"]}>
              <div>{recipe.calories.toFixed()} kcal</div>
              <div>{recipe.time} min</div>
            </div>
            <div className={classes.text}>
              <p className={classes["recipe-card__title"]}>{recipe.title}</p>
            </div>
          </div>
          <a href="/" className={classes["recipe-card__btn-more"]}>
            Read More
          </a>
        </div>
      ))}
    </>
  );
}

export default RecipeCard;
