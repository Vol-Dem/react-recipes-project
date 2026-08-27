import {
  VALIDATION_EMAIL_MAX_LENGTH,
  VALIDATION_PASSWORD_MAX_LENGTH,
} from "../../../shared/constants";

export const RESET_EMAIL_VALIDATION = Object.freeze({
  required: true,
  email: true,
  maxLength: VALIDATION_EMAIL_MAX_LENGTH,
});

export const EMAIL_VALIDATION = Object.freeze({
  login: Object.freeze({
    ...RESET_EMAIL_VALIDATION,
    disableErrorOnBlur: true,
  }),
  signup: Object.freeze({
    ...RESET_EMAIL_VALIDATION,
    disableErrorOnBlur: false,
  }),
});

export const PASSWORD_VALIDATION = Object.freeze({
  login: Object.freeze({
    required: true,
    password: true,
    maxLength: VALIDATION_PASSWORD_MAX_LENGTH,
    disableErrorOnBlur: true,
  }),
  signup: Object.freeze({
    required: true,
    password: true,
    maxLength: VALIDATION_PASSWORD_MAX_LENGTH,
    disableErrorOnBlur: false,
  }),
});
