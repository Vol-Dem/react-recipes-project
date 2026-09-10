"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { reportError } from "../../../../shared/utils/errorPresentation";
import { recipeDetailsQueryKey } from "../../queries/recipeDetailsQueryKey";
import { getRecipeErrorMessage } from "../../utils/recipeErrors";
import RecipeRouteFeedback from "../RecipeRouteFeedback/RecipeRouteFeedback";

interface RecipeRouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

const RecipeRouteError = ({ error, retry }: RecipeRouteErrorProps) => {
  const client = useQueryClient();
  const { recipeId } = useParams<{ recipeId: string }>() ?? {};

  useEffect(() => {
    reportError(error, { source: "recipe-route" });
  }, [error]);

  const retryRecipe = () => {
    if (recipeId) {
      for (const source of ["api", "firestore"] as const) {
        client.removeQueries({
          queryKey: recipeDetailsQueryKey(recipeId, source),
          exact: true,
          predicate: (query) =>
            query.state.status === "error" && query.state.data === undefined,
        });
      }
    }
    // Next's retry refreshes server data and resets this segment's boundary.
    retry();
  };

  return (
    <RecipeRouteFeedback
      message={getRecipeErrorMessage(error.cause ?? error)}
      onRetry={retryRecipe}
    />
  );
};

export default RecipeRouteError;
