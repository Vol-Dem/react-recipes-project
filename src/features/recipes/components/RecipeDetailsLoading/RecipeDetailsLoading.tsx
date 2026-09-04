import RecipeDescriptionSkeleton from "../skeletons/RecipeDescriptionSkeleton/RecipeDescriptionSkeleton";
import RecipeHeadSkeleton from "../skeletons/RecipeHeadSkeleton/RecipeHeadSkeleton";
import RecipeDetailsShell from "../RecipeDetailsShell/RecipeDetailsShell";

const RecipeDetailsLoading = () => (
  <RecipeDetailsShell header={<RecipeHeadSkeleton />}>
    <RecipeDescriptionSkeleton />
  </RecipeDetailsShell>
);

export default RecipeDetailsLoading;
