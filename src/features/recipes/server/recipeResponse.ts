import "server-only";
import { ZodError } from "zod";
import { RecipeHttpError } from "../api/requestRecipeJson";
import { getRecipeErrorMessage } from "../utils/recipeErrors";

export const recipeResponse = async (load: () => Promise<unknown>) => {
  const headers = { "Cache-Control": "no-store" };
  try {
    return Response.json(await load(), { headers });
  } catch (error) {
    const status =
      error instanceof ZodError
        ? 400
        : error instanceof RecipeHttpError
          ? error.status
          : error instanceof Error && error.name === "TimeoutError"
            ? 504
            : error instanceof TypeError
              ? 503
              : 500;
    // Never send provider bodies, request URLs, credentials, or stack traces.
    return Response.json(
      {
        status: "failure",
        code: status,
        message:
          status === 400
            ? "Invalid recipe request"
            : getRecipeErrorMessage({ status }),
      },
      { status, headers },
    );
  }
};
