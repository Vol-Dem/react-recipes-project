import RecipesPage from "../../features/recipes/pages/RecipesPage/RecipesPage";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import Spinner from "../../shared/components/ui/Spinner/Spinner";

const RecipesLayout = ({ children }: PropsWithChildren) => (
  <Suspense fallback={<Spinner />}>
    <RecipesPage>{children}</RecipesPage>
  </Suspense>
);

export default RecipesLayout;
