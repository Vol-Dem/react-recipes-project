import Buttton from "./Button";
import Card from "./Card";
import classes from "./Notification.module.scss";
import { ReactComponent as TriangleIcon } from "./../../assets/triangle.svg";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { notificationActions } from "../../store/notification";

const Notification = ({ title, message }) => {
  const dispatch = useDispatch();
  const closeNotificationHandler = () => {
    dispatch(notificationActions.closeNotification());
  };
  return (
    <>
      {createPortal(
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
        </Card>,
        document.body
      )}
    </>
  );
};

export default Notification;
