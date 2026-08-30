import Input from "../../../../shared/components/ui/Input/Input";
import ButtonSecondary from "../../../../shared/components/ui/ButtonSecondary/ButtonSecondary";
import classes from "./EditableProfileField.module.scss";

const EditableProfileField = ({
  displayValue,
  inputName,
  inputPlaceholder,
  inputType,
  isEditing,
  onSubmit,
  onToggle,
}) => (
  <form className={classes["profile__form"]} onSubmit={onSubmit}>
    {!isEditing && <span>{displayValue}</span>}
    {isEditing && (
      <>
        <Input
          name={inputName}
          type={inputType}
          placeholder={inputPlaceholder}
        />
        <ButtonSecondary>Submit</ButtonSecondary>
      </>
    )}
    <ButtonSecondary type="button" onClick={onToggle}>
      {isEditing ? "Cancel" : "Change"}
    </ButtonSecondary>
  </form>
);

export default EditableProfileField;
