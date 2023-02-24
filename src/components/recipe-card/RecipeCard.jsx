import classes from "./RecipeCard.module.css";

function RecipeCard(props) {
  const recipeInfo = props.data;
  // console.log(props.data);
  return (
    <div className={classes.recipes}>
      {recipeInfo.map((recipe) => (
        <div key={recipe.id} className={classes["recipe-card"]}>
          <img src={recipe.img} alt={recipe.title} className={classes.img} />
          <div className={classes["recipe-card__text"]}>
            <div className={classes["recipe-card__info"]}>
              <div>{recipe.calories[0].amount} cal</div>
              <div>{recipe.time} min</div>
            </div>
            <div className={classes.text}>
              <p className={classes["recipe-card__title"]}>{recipe.title}</p>
              <a href="#" className={classes["recipe-card__btn-more"]}>
                Read More
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeCard;
