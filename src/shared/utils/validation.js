/**
 * Validate input data
 * @param {Object} rules - Enabled validation rules
 * @param {string} value - Input value
 * @returns {Object} Validation result
 */
export const validateInput = (rules, value) => {
  const validTypes = rules;
  if (!validTypes) {
    return;
  }

  const errorMessages = [];
  Object.keys(validTypes).forEach((type) => {
    if (validTypes[type] && type === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const errorMessage = isValid ? "" : "Please enter a valid email address";
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "lowercase") {
      const isValid = /[a-z]/.test(value);
      const errorMessage = isValid
        ? ""
        : "Password must include a lowercase letter";
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "uppercase") {
      const isValid = /[A-Z]/.test(value);
      const errorMessage = isValid
        ? ""
        : "Password must include an uppercase letter";
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "digit") {
      const isValid = /\d/.test(value);
      const errorMessage = isValid ? "" : "Password must include a number";
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "specialCharacter") {
      const isValid = /[^A-Za-z0-9\s]/.test(value);
      const errorMessage = isValid
        ? ""
        : "Password must include a special character";
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "noWhitespace") {
      const isValid = !/\s/.test(value);
      const errorMessage = isValid ? "" : "Password cannot contain whitespace";
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "required") {
      const isValid = value.length > 0;

      const errorMessage = isValid ? "" : "This field is required";
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "number") {
      const isValid = Number.isFinite(+value);
      const errorMessage = isValid ? "" : `Value must be a number`;
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "maxLength") {
      const isValid = value.length <= validTypes[type];
      const errorMessage = isValid
        ? ""
        : `Value cannot be more than ${validTypes[type]} characters`;
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
    if (validTypes[type] && type === "minLength") {
      const isValid = value.length >= validTypes[type];
      const errorMessage = isValid
        ? ""
        : `Value cannot be less than ${validTypes[type]} characters`;
      if (errorMessage) {
        errorMessages.push(errorMessage);
      }
    }
  });
  const isValid = !errorMessages.length;
  const errorMessage = !isValid ? errorMessages[0] : "";

  return { inputValue: value, isValid, errorMessage };
};
