export const RECIPE_LIST_INITIAL_ANIMATION = { opacity: 0, y: 0 };
export const RECIPE_LIST_VISIBLE_ANIMATION = { opacity: 1, y: 0 };
export const RECIPE_CARDS_VARIANTS = {
  visible: { transition: { staggerChildren: 0.5 } },
};
export const RECIPE_CARD_INITIAL_ANIMATION = {
  opacity: 0,
  scale: 0.8,
};
export const RECIPE_CARD_VARIANTS = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" },
  },
};
export const RECIPE_CARD_HOVER_ANIMATION = {
  scale: 1.04,
  transition: { type: "tween" },
};
