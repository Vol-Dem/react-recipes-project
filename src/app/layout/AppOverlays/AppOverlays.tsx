"use client";

import { AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store";
import AuthForm from "../../../features/auth/components/AuthForm/AuthForm";
import { selectAuthFormIsOpen } from "../../../features/auth/store/authSelectors";
import { authActions } from "../../../features/auth/store/authSlice";
import Notification from "../../../features/notifications/components/Notification/Notification";
import {
  selectNotificationIsShown,
  selectNotificationMessage,
  selectNotificationSeverity,
  selectNotificationTitle,
} from "../../../features/notifications/store/notificationSelectors";
import Modal from "../../../shared/components/ui/Modal/Modal";

const AppOverlays = () => {
  const authIsOpen = useSelector(selectAuthFormIsOpen);
  const notificationIsShown = useSelector(selectNotificationIsShown);
  const notificationTitle = useSelector(selectNotificationTitle);
  const notificationMessage = useSelector(selectNotificationMessage);
  const notificationSeverity = useSelector(selectNotificationSeverity);
  const dispatch = useDispatch<AppDispatch>();

  const closeAuth = () => {
    dispatch(authActions.closeAuthForm());
  };

  return (
    <AnimatePresence>
      {authIsOpen && (
        <Modal labelledBy="auth-dialog-title" onClose={closeAuth}>
          <AuthForm />
        </Modal>
      )}
      {notificationIsShown && (
        <Notification
          title={notificationTitle}
          message={notificationMessage}
          severity={notificationSeverity}
        />
      )}
    </AnimatePresence>
  );
};

export default AppOverlays;
