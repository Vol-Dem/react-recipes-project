import Button from "../../../../shared/components/ui/Button/Button";
import Card from "../../../../shared/components/ui/Card/Card";
import classes from "./Notification.module.scss";
import TriangleIcon from "../../../../assets/icons/triangle.svg?react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../store/notificationSlice";
import { motion } from "framer-motion";

const NOTIFICATION_HIDDEN_ANIMATION = {
  opacity: 0,
  x: "-50%",
  y: 30,
};
const NOTIFICATION_VISIBLE_ANIMATION = {
  opacity: 1,
  x: "-50%",
  y: 0,
};

const Notification = ({ title, message }) => {
  const dispatch = useDispatch();
  const closeNotificationHandler = () => {
    dispatch(notificationActions.closeNotification());
  };

  return createPortal(
    <motion.div
      role="status"
      aria-live="polite"
      initial={NOTIFICATION_HIDDEN_ANIMATION}
      animate={NOTIFICATION_VISIBLE_ANIMATION}
      exit={NOTIFICATION_HIDDEN_ANIMATION}
      className={classes["notification-container"]}
    >
      <Card className={classes.notification}>
        <TriangleIcon />
        <div>
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
  );
};

export default Notification;
