import { useState } from "react";
import type { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeUserName, changeUserPassword } from "../store/authThunks";
import { selectAuthErrorMessage, selectAuthUser } from "../store/authSelectors";
import type { AppDispatch } from "../../../app/store";

export const useProfileController = () => {
  const [editing, setEditing] = useState({
    name: false,
    password: false,
  });
  const dispatch = useDispatch<AppDispatch>();
  const errorMessage = useSelector(selectAuthErrorMessage);
  const user = useSelector(selectAuthUser);

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

  const submitName = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    dispatch(changeUserName(String(formData.get("name") ?? "")));
    setEditing((currentEditing) => ({
      ...currentEditing,
      name: false,
    }));
  };

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    dispatch(changeUserPassword(String(formData.get("pass") ?? "")));
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
