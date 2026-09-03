import Input from "../../../../shared/components/ui/Input/Input";
import ButtonSecondary from "../../../../shared/components/ui/ButtonSecondary/ButtonSecondary";
import classes from "./EditableProfileField.module.scss";
import type { FormEventHandler, HTMLInputTypeAttribute } from "react";

interface EditableProfileFieldProps {
  displayValue: string;
  inputName: string;
  inputPlaceholder?: string;
  inputType: HTMLInputTypeAttribute;
  isEditing: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onToggle: () => void;
}

const EditableProfileField = ({
  displayValue,
  inputName,
  inputPlaceholder,
  inputType,
  isEditing,
  onSubmit,
  onToggle,
}: EditableProfileFieldProps) => (
  <form className={classes["profile__form"]} onSubmit={onSubmit}>
    {!isEditing && <span>{displayValue}</span>}
    {isEditing && (
      <>
        <Input
          name={inputName}
          type={inputType}
          autoComplete={inputType === "password" ? "new-password" : "name"}
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
