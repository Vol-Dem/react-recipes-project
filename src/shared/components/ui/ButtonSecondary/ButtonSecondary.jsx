import classes from "./ButtonSecondary.module.scss";

const ButtonSecondary = ({ children, className, disabled, onClick, type }) => {
  return (
    <button
      className={`${classes["btn-secondary"]} ${className || ""}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
