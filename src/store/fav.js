import { createSlice } from "@reduxjs/toolkit";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import firebaseApp from "../config";

const firestore = getFirestore(firebaseApp);

const favSlice = createSlice({
  name: "fav",
  initialState: { favList: [], recipes: [] },
  reducers: {
    addToFav(state, actions) {
      if (!state.favList.includes(actions.payload)) {
        state.favList.push(actions.payload);
      } else {
        state.favList = state.favList.filter((id) => id !== actions.payload);
      }
    },
    updateFav(state, actions) {
      state.favList = actions.payload;
    },
  },
});

export const sendFav = (id) => {
  return async (dispatch, getState) => {
    dispatch(favActions.addToFav(id));
    const userId = getState().auth.user.uid;
    const favList = getState().fav.favList;
    const favRef = doc(firestore, "favorites", userId);
    try {
      await setDoc(favRef, { favList: favList });
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const loadFav = () => {
  return async (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const favRef = doc(firestore, "favorites", uid);
    const favSnap = await getDoc(favRef);
    if (favSnap.exists()) {
      const favList = favSnap.data().favList;
      dispatch(favActions.updateFav(favList));
    }
  };
};

export const favActions = favSlice.actions;

export default favSlice;
