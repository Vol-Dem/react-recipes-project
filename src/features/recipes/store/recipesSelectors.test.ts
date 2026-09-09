import { selectRecipeDailyLimitIsReached } from "./recipesSelectors";

describe("recipe selectors", () => {
  it.each([false, true])(
    "selects the quota flag (%s)",
    (dailyLimitIsReached) => {
      expect(
        selectRecipeDailyLimitIsReached({ recipe: { dailyLimitIsReached } }),
      ).toBe(dailyLimitIsReached);
    },
  );
});
