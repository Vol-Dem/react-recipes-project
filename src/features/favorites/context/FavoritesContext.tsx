"use client";

import { createContext, useContext, type PropsWithChildren } from "react";
import { useFavoritesController } from "../hooks/useFavoritesController";

const FavoritesContext = createContext<ReturnType<
  typeof useFavoritesController
> | null>(null);

export const FavoritesProvider = ({ children }: PropsWithChildren) => {
  const favorites = useFavoritesController();
  return <FavoritesContext value={favorites}>{children}</FavoritesContext>;
};

export const useFavorites = () => {
  const favorites = useContext(FavoritesContext);
  if (!favorites) throw new Error("Favorites provider is required");
  return favorites;
};
