import RecipesPage from "../../features/recipes/pages/RecipesPage/RecipesPage";
import type { PropsWithChildren } from "react";

const RecipesLayout = ({ children }: PropsWithChildren) => (
  <RecipesPage>{children}</RecipesPage>
);

export default RecipesLayout;
