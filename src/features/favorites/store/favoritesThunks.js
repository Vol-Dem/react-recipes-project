import { selectAuthUserId } from "../../auth/store/authSelectors";
import { notificationActions } from "../../notifications/store/notificationSlice";
import { fetchFavoriteIds, updateFavorite } from "../api/favoritesApi";
import {
  FAVORITES_LOAD_ERROR_NOTIFICATION,
  FAVORITES_UPDATE_ERROR_NOTIFICATION,
} from "../constants/messages";
import {
  selectIsFavorite,
  selectIsFavoriteUpdatePending,
} from "./favoritesSelectors";
import { favoritesActions } from "./favoritesSlice";

export const toggleFavorite = (recipeId) => {
  return async (dispatch, getState) => {
    if (selectIsFavoriteUpdatePending(getState(), recipeId)) {
      return;
    }

    const userId = selectAuthUserId(getState());
    const wasFavorite = selectIsFavorite(getState(), recipeId);

    dispatch(favoritesActions.startFavoriteUpdate(recipeId));
    dispatch(favoritesActions.toggleFavorite(recipeId));

    try {
      await updateFavorite(userId, recipeId, !wasFavorite);
    } catch {
      const userIsUnchanged = selectAuthUserId(getState()) === userId;
      const favoriteStateChanged =
        selectIsFavorite(getState(), recipeId) !== wasFavorite;

      if (userIsUnchanged && favoriteStateChanged) {
        dispatch(favoritesActions.toggleFavorite(recipeId));
      }

      if (userIsUnchanged) {
        dispatch(
          notificationActions.showNotification(
            FAVORITES_UPDATE_ERROR_NOTIFICATION,
          ),
        );
      }
    } finally {
      dispatch(favoritesActions.finishFavoriteUpdate(recipeId));
    }
  };
};

export const loadFavorites = (userId) => {
  return async (dispatch) => {
    try {
      const favoriteIds = await fetchFavoriteIds(userId);
      dispatch(favoritesActions.setFavoriteIds(favoriteIds));
    } catch {
      dispatch(
        notificationActions.showNotification(FAVORITES_LOAD_ERROR_NOTIFICATION),
      );
    }
  };
};
