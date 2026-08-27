const sanitizeQuery = (value) =>
  String(value ?? "")
    .replace(/<[^>]*>|[^a-zA-Z0-9,;\-.!?<> ]/g, "")
    .toLowerCase()
    .trim();

const sanitizeNumericFilter = (value) =>
  String(value ?? "").replace(/[^0-9 ]/g, "");

export const parseSearchFormData = (formData) => ({
  query: sanitizeQuery(formData.get("query")),
  cuisine: formData.getAll("cuisine").join(","),
  diet: formData.getAll("diet").join(","),
  intolerance: formData.getAll("intolerance").join(","),
  type: formData.getAll("type").join(","),
  maxReadyTime: sanitizeNumericFilter(formData.get("max-ready-time")),
  minCalories: sanitizeNumericFilter(formData.get("min-calories")),
  maxCalories: sanitizeNumericFilter(formData.get("max-calories")),
});
