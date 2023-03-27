import classes from "./Input.module.scss";

const Input = ({ label, input }) => {
  return (
    <>
      {label && (
        <label htmlFor={input.id} className={classes.label}>
          {label}
        </label>
      )}
      <input {...input} className={classes.input} />
    </>
  );
};

export default Input;
