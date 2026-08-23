import classes from "./ButtonSecondary.module.scss";

const ButtonSecondary = (props) => {
  return (
    <button
      className={`${classes["btn-secondary"]} ${props.className || ""}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default ButtonSecondary;
