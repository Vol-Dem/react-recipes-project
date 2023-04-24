import Card from "./Card";
import classes from "./Modal.module.scss";
import { createPortal } from "react-dom";

const Modal = (props) => {
  return (
    <>
      {createPortal(
        <>
          <div
            className={`${classes.modal} ${classes["modal--backdrop"]}`}
            onClick={props.onClose}
          ></div>
          <Card className={`${classes.modal} ${classes["modal--content"]}`}>
            {props.children}
          </Card>
        </>,
        document.body
      )}
    </>
  );
};

export default Modal;
