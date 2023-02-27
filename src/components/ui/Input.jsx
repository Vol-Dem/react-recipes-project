import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div>
      <label htmlFor={props.input.id} className={classes.label}>
        {props.label}
      </label>
      <input {...props.input} className={classes.input} />
    </div>
  );
};

export default Input;
