import { motion } from "framer-motion";
import { RECIPES_PER_PAGE } from "../../../../shared/constants";
import RecipeItemSkeleton from "../skeletons/RecipeItemSkeleton/RecipeItemSkeleton";
import RecipeCard from "../RecipeCard/RecipeCard";
import classes from "./RecipeCards.module.scss";

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
      variants={{ visible: { transition: { staggerChildren: 0.5 } } }}
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
