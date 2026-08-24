import Button from "./Button";
import Card from "./Card";
import classes from "./Notification.module.scss";
import TriangleIcon from "./../../assets/triangle.svg?react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../store/notification";
import { motion } from "framer-motion";

const Notification = ({ title, message }) => {
  const dispatch = useDispatch();
  const closeNotificationHandler = () => {
    dispatch(notificationActions.closeNotification());
  };
  return (
    <>
      {createPortal(
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 30, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 30, x: "-50%" }}
          className={classes["notification-container"]}
        >
          <Card className={classes.notification}>
            <TriangleIcon />
            <div className={classes["notification__message"]}>
              <h4 className={classes["notification__title"]}>{title}</h4>
              <p className={classes["notification__text"]}>{message}</p>
            </div>
            <Button
              className={classes["notification__btn"]}
              onClick={closeNotificationHandler}
            >
              Got it!
            </Button>
          </Card>
        </motion.div>,
        document.body,
      )}
    </>
  );
};

export default Notification;
