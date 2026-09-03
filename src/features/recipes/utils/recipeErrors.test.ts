import { ERROR_MESSAGE_OFFLINE } from "../../../shared/constants";
import {
  RECIPE_ERROR_MESSAGE_DEFAULT,
  RECIPE_ERROR_MESSAGE_NOT_FOUND,
  RECIPE_ERROR_MESSAGE_RATE_LIMIT,
  RECIPE_ERROR_MESSAGE_TIMEOUT,
} from "../constants/messages";
import { getRecipeErrorMessage, isRecipeApiLimitError } from "./recipeErrors";

describe("recipe error handling", () => {
  it("identifies the API daily limit by response status", () => {
    expect(
      isRecipeApiLimitError({
        message: "Payment required",
        response: { status: 402 },
      }),
    ).toBe(true);
    expect(
      isRecipeApiLimitError({
        response: { data: { code: 402 }, status: 200 },
      }),
    ).toBe(true);
    expect(isRecipeApiLimitError({ message: "402" })).toBe(false);
  });

  it("maps connection and timeout failures", () => {
    expect(getRecipeErrorMessage({ code: "ERR_NETWORK" })).toBe(
      ERROR_MESSAGE_OFFLINE,
    );
    expect(getRecipeErrorMessage({ name: "TimeoutError" })).toBe(
      RECIPE_ERROR_MESSAGE_TIMEOUT,
    );
  });

  it("maps actionable response statuses", () => {
    expect(getRecipeErrorMessage({ response: { status: 404 } })).toBe(
      RECIPE_ERROR_MESSAGE_NOT_FOUND,
    );
    expect(getRecipeErrorMessage({ response: { status: 429 } })).toBe(
      RECIPE_ERROR_MESSAGE_RATE_LIMIT,
    );
  });

  it("uses a safe fallback instead of exposing technical messages", () => {
    expect(
      getRecipeErrorMessage(new Error("Request failed with internal details")),
    ).toBe(RECIPE_ERROR_MESSAGE_DEFAULT);
  });
});
