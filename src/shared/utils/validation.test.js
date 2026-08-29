import { validateInput } from "./validation";

const passwordRules = {
  required: true,
  minLength: 8,
  maxLength: 100,
  noWhitespace: true,
  lowercase: true,
  uppercase: true,
  digit: true,
  specialCharacter: true,
};

describe("validateInput", () => {
  it.each([
    ["user@example.com", true],
    ["user@", false],
    ["user example@example.com", false],
    ["user@example", false],
  ])("validates email addresses", (value, expectedIsValid) => {
    expect(validateInput({ email: true }, value).isValid).toBe(
      expectedIsValid,
    );
  });

  it.each([
    ["Aa1!", "Value cannot be less than 8 characters"],
    ["UPPERCASE1!", "Password must include a lowercase letter"],
    ["lowercase1!", "Password must include an uppercase letter"],
    ["NoNumber!", "Password must include a number"],
    ["NoSpecial1", "Password must include a special character"],
    ["Has space1!", "Password cannot contain whitespace"],
  ])("rejects weak passwords", (value, expectedError) => {
    expect(validateInput(passwordRules, value)).toMatchObject({
      isValid: false,
      errorMessage: expectedError,
    });
  });

  it("accepts a password that satisfies every rule", () => {
    expect(validateInput(passwordRules, "Strong1!")).toMatchObject({
      isValid: true,
      errorMessage: "",
    });
  });
});
