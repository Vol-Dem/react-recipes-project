import { mapRecipe } from "./mapRecipe";

describe("mapRecipe", () => {
  it("maps an API or Firestore recipe to the recipe-card shape", () => {
    const recipe = {
      id: 42,
      title: "Pasta",
      image: "pasta.webp",
      readyInMinutes: 25,
      nutrition: {
        nutrients: [
          { name: "Protein", amount: 12 },
          { name: "Calories", amount: 450 },
        ],
      },
      servings: 4,
    };

    expect(mapRecipe(recipe)).toEqual({
      id: 42,
      title: "Pasta",
      img: "pasta.webp",
      readyInMinutes: 25,
      calories: 450,
      servings: 4,
    });
  });
});
