import Buttton from "./Button";
import Card from "./Card";
import classes from "./Notification.module.scss";
import { ReactComponent as TriangleIcon } from "./../../assets/triangle.svg";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../store/notification";
import { motion } from "framer-motion";
import {
  ANIMATION_SLIDE_IN,
  ANIMATION_SLIDE_IN_INITIAL,
} from "../../variables/constants";

const Notification = ({ title, message }) => {
  const dispatch = useDispatch();
  const closeNotificationHandler = () => {
    dispatch(notificationActions.closeNotification());
  };
  return (
    <>
      {createPortal(
        <motion.div
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
            <Buttton
              className={classes["notification__btn"]}
              onClick={closeNotificationHandler}
            >
              Got it!
            </Buttton>
          </Card>
        </motion.div>,
        document.body
      )}
    </>
  );
};

export default Notification;
