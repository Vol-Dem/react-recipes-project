import {
  VALIDATION_EMAIL_MAX_LENGTH,
  VALIDATION_PASSWORD_MAX_LENGTH,
  VALIDATION_PASSWORD_MIN_LENGTH,
} from "../../../shared/constants";
import type { ValidationRules } from "../../../shared/types/validation";

export const RESET_EMAIL_VALIDATION: Readonly<ValidationRules> = Object.freeze({
  required: true,
  email: true,
  maxLength: VALIDATION_EMAIL_MAX_LENGTH,
});

export const EMAIL_VALIDATION: Readonly<
  Record<"login" | "signup", Readonly<ValidationRules>>
> = Object.freeze({
  login: Object.freeze({ required: true }),
  signup: RESET_EMAIL_VALIDATION,
});

export const PASSWORD_VALIDATION: Readonly<
  Record<"login" | "signup", Readonly<ValidationRules>>
> = Object.freeze({
  login: Object.freeze({ required: true }),
  signup: Object.freeze({
    required: true,
    minLength: VALIDATION_PASSWORD_MIN_LENGTH,
    maxLength: VALIDATION_PASSWORD_MAX_LENGTH,
    noWhitespace: true,
    lowercase: true,
    uppercase: true,
    digit: true,
    specialCharacter: true,
  }),
});
