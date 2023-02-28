import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <>
      {props.label && (
        <label htmlFor={props.input.id} className={classes.label}>
          {props.label}
        </label>
      )}
      <input {...props.input} className={classes.input} />
    </>
  );
};

export default Input;