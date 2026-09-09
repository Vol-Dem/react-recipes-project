export const SEARCH_FILTER_KEYS = [
  "query",
  "cuisine",
  "diet",
  "intolerance",
  "type",
  "maxReadyTime",
  "minCalories",
  "maxCalories",
] as const;

export const INVALID_SEARCH_MESSAGE =
  "Invalid search filters. Please update your search and try again";
