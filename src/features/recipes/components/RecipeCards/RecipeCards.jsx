import { motion } from "framer-motion";
import { RECIPES_PER_PAGE } from "../../../../shared/constants";
import RecipeItemSkeleton from "../skeletons/RecipeItemSkeleton/RecipeItemSkeleton";
import RecipeCard from "../RecipeCard/RecipeCard";
import classes from "./RecipeCards.module.scss";
import { RECIPE_CARDS_VARIANTS } from "../../constants/animations";

const RecipeCards = ({
  isLoading,
  isRecipeOpen,
  recipes,
  skeletonItemsAmount,
}) => {
  const cardClassName = `${classes["cards-container"]} ${
    isRecipeOpen ? classes["cards-container--side"] : ""
  }`;
  const skeletons = Array.from(
    { length: skeletonItemsAmount || RECIPES_PER_PAGE },
    (_, index) => <RecipeItemSkeleton key={index} />,
  );

  return (
    <motion.ul
      variants={RECIPE_CARDS_VARIANTS}
      className={cardClassName}
    >
      {!isLoading &&
        recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      {isLoading && skeletons}
    </motion.ul>
  );
};

export default RecipeCards;
