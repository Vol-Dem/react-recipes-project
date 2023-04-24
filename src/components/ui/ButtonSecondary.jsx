import classes from "./ButtonSecondary.module.scss";

const ButttonSecondary = (props) => {
  return (
    <button
      className={`${classes["btn-secondary"]} ${props.className || ""}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default ButttonSecondary;
