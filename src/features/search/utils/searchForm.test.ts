import { parseSearchFormData } from "./searchForm";

describe("parseSearchFormData", () => {
  it("sanitizes the query and numeric filters", () => {
    const formData = new FormData();
    formData.set("query", "  <b>PASTA</b> 🍝  ");
    formData.set("max-ready-time", "30 minutes");
    formData.set("min-calories", "200kcal");
    formData.set("max-calories", "600kcal");

    expect(parseSearchFormData(formData)).toMatchObject({
      query: "pasta",
      maxReadyTime: "30 ",
      minCalories: "200",
      maxCalories: "600",
    });
  });

  it("combines multiple checkbox values", () => {
    const formData = new FormData();
    formData.append("cuisine", "italian");
    formData.append("cuisine", "japanese");
    formData.append("diet", "vegetarian");
    formData.append("intolerance", "gluten");
    formData.append("type", "soup");

    expect(parseSearchFormData(formData)).toMatchObject({
      cuisine: "italian,japanese",
      diet: "vegetarian",
      intolerance: "gluten",
      type: "soup",
    });
  });

  it("returns empty strings for missing fields", () => {
    expect(parseSearchFormData(new FormData())).toEqual({
      query: "",
      cuisine: "",
      diet: "",
      intolerance: "",
      type: "",
      maxReadyTime: "",
      minCalories: "",
      maxCalories: "",
    });
  });
});
