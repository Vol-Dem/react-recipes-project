import classes from "./RecipeCardList.module.css";

function RecipeCardList(props) {
  return <div className={classes["recipe-container"]}>{props.children}</div>;
}

export default RecipeCardList;
