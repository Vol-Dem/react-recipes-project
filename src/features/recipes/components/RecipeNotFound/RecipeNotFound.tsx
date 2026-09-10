import { RECIPE_ERROR_MESSAGE_NOT_FOUND } from "../../constants/messages";
import RecipeRouteFeedback from "../RecipeRouteFeedback/RecipeRouteFeedback";

const RecipeNotFound = () => (
  <RecipeRouteFeedback message={RECIPE_ERROR_MESSAGE_NOT_FOUND} />
);

export default RecipeNotFound;
