/**
 * Validate input data
 * @param {string} rules - Type of validation (email, password, required, minLength, maxLength, number, string)
 * @param {Object} value - value
 * @returns {Array} - Returns state object {inputValue, isValid, errorMessage}
 */
export const validateInput = (rules, value) => {
  const validTypes = rules;
  if (!validTypes) {
    return;
  }

  const errorMessages = [];
  Object.keys(validTypes).forEach((type) => {
    if (!!validTypes[type] && type === "email") {
      const isValid = value.split("").includes("@");
      const errorMessage = isValid ? "" : "Please enter a valid email address";
      if (!!errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (!!validTypes[type] && type === "password") {
      const isValid = value.length >= 6;
      const errorMessage = isValid
        ? ""
        : "Password must be 6 or more characters";

      if (!!errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (!!validTypes[type] && type === "required") {
      const isValid = !!value;

      const errorMessage = isValid ? "" : "This field is required";
      if (!!errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (!!validTypes[type] && type === "number") {
      const isValid = Number.isFinite(+value);
      const errorMessage = isValid ? "" : `Value must be a number`;
      if (!!errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (!!validTypes[type] && type === "maxLength") {
      const isValid = !(value.length > validTypes[type]);
      const errorMessage = isValid
        ? ""
        : `Value cannot be more than ${validTypes[type]} characters`;
      if (!!errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (!!validTypes[type] && type === "minLength") {
      const isValid = value.length >= validTypes[type];
      const errorMessage = isValid
        ? ""
        : `Value cannot be less than ${validTypes[type]} characters`;
      if (!!errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
  });
  const isValid = !errorMessages.length;
  const errorMessage = !isValid ? errorMessages[0] : "";

  return { inputValue: value, isValid, errorMessage };
};
