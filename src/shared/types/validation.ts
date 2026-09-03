export interface ValidationRules {
  email?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  digit?: boolean;
  specialCharacter?: boolean;
  noWhitespace?: boolean;
  required?: boolean;
  number?: boolean;
  maxLength?: number;
  minLength?: number;
  disableErrorOnBlur?: boolean;
}

export interface ValidationResult {
  inputValue: string;
  isValid: boolean;
  errorMessage: string;
}
