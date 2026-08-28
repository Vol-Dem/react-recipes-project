import { act, renderHook } from "@testing-library/react";
import { useInputValidation } from "./useInputValidation";

const requiredValidation = Object.freeze({ required: true });

describe("useInputValidation", () => {
  it("validates the current value and follows external error visibility", () => {
    const { result, rerender } = renderHook(
      ({ showError, value }) =>
        useInputValidation({
          showError,
          validation: requiredValidation,
          value,
        }),
      { initialProps: { showError: false, value: "" } },
    );

    expect(result.current.errorMessage).toBe("This field is required");
    expect(result.current.shouldShowError).toBe(false);

    rerender({ showError: true, value: "valid value" });

    expect(result.current.errorMessage).toBe("");
    expect(result.current.shouldShowError).toBe(true);
  });

  it("forwards blur events and reveals validation errors", () => {
    const onBlur = vi.fn();
    const event = { target: { value: "" } };
    const { result } = renderHook(() =>
      useInputValidation({
        onBlur,
        validation: requiredValidation,
        value: "",
      }),
    );

    act(() => {
      result.current.handleBlur(event);
    });

    expect(onBlur).toHaveBeenCalledWith(event);
    expect(result.current.shouldShowError).toBe(true);
  });

  it("reports validation results when the value changes", () => {
    const onChange = vi.fn();
    const event = { target: { value: "valid value" } };
    const { result } = renderHook(() =>
      useInputValidation({
        onChange,
        validation: requiredValidation,
        value: "",
      }),
    );

    act(() => {
      result.current.handleChange(event);
    });

    expect(onChange).toHaveBeenCalledWith(event, true, "");
    expect(result.current.errorMessage).toBe("");
  });

  it("forwards change events without validation metadata", () => {
    const onChange = vi.fn();
    const event = { target: { value: "plain value" } };
    const { result } = renderHook(() =>
      useInputValidation({ onChange, value: "" }),
    );

    act(() => {
      result.current.handleChange(event);
    });

    expect(onChange).toHaveBeenCalledWith(event);
    expect(result.current.shouldShowError).toBe(false);
  });
});
