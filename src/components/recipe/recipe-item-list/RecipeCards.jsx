import { motion } from "framer-motion";
import { RECIPES_PER_PAGE } from "../../../constants";
import RecipeItemSkeleton from "../../skeletons/RecipeItemSkeleton";
import RecipeItem from "../recipe-item/RecipeItem";
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
          <RecipeItem key={recipe.id} recipe={recipe} />
        ))}
      {isLoading && skeletons}
    </motion.ul>
  );
};

export default RecipeCards;
