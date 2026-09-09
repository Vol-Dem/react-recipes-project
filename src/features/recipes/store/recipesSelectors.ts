import type { RootState } from "../../../app/store";

type RecipeRootState = Pick<RootState, "recipe">;

export const selectRecipeDailyLimitIsReached = (state: RecipeRootState) =>
  state.recipe.dailyLimitIsReached;
