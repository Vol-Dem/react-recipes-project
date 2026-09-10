import RecipeDetailsLoading from "../../../features/recipes/components/RecipeDetailsLoading/RecipeDetailsLoading";

const RecipeLoading = () => (
  <>
    {/* React applies this fallback title after hydration, not in the server shell. */}
    <title>Loading recipe | Your Recipe Book</title>
    <RecipeDetailsLoading />
  </>
);

export default RecipeLoading;
