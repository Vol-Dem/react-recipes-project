import classes from "./Checkbox.module.css";

const Checkbox = (props) => {
  return (
    <div>
      <input
        type="checkbox"
        id={props.value}
        value={props.value}
        name={props.name}
        className={classes.input}
      />
      <label htmlFor={props.value} className={classes.label}>
        {props.value}
      </label>
    </div>
  );
};

export default Checkbox;
