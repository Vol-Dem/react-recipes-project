import classes from "./Button.module.scss";

const Buttton = (props) => {
  return (
    <button
      className={`${classes.btn} ${props.className || ""}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Buttton;
