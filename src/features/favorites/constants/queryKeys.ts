export const favoriteKeys = {
  account: (userId: string) => ["favorites", userId] as const,
  ids: (userId: string) => ["favorites", userId, "ids"] as const,
  update: (userId: string) => ["favorites", userId, "update"] as const,
};
