import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserName,
  changeUserPassword,
} from "../store/authThunks";

export const useProfileController = () => {
  const [editing, setEditing] = useState({
    name: false,
    password: false,
  });
  const dispatch = useDispatch();
  const errorMessage = useSelector((state) => state.auth.errorMessage);
  const user = useSelector((state) => state.auth.user);

  const toggleNameEditing = () => {
    setEditing((currentEditing) => ({
      ...currentEditing,
      name: !currentEditing.name,
    }));
  };

  const togglePasswordEditing = () => {
    setEditing((currentEditing) => ({
      ...currentEditing,
      password: !currentEditing.password,
    }));
  };

  const submitName = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    dispatch(changeUserName(formData.get("name")));
    setEditing((currentEditing) => ({
      ...currentEditing,
      name: false,
    }));
  };

  const submitPassword = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    dispatch(changeUserPassword(formData.get("pass")));
  };

  return {
    actions: {
      submitName,
      submitPassword,
      toggleNameEditing,
      togglePasswordEditing,
    },
    editing,
    status: { errorMessage },
    user,
  };
};
