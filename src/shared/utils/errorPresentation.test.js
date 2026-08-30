import { ERROR_MESSAGE_DEFAULT } from "../constants";
import { getErrorPresentation } from "./errorPresentation";

describe("error presentation", () => {
  it("returns user-friendly content for known response statuses", () => {
    expect(getErrorPresentation({ status: 404 })).toEqual({
      status: 404,
      heading: "Page not found",
      message: "The page you requested does not exist",
    });
    expect(getErrorPresentation({ status: 503 })).toEqual({
      status: 503,
      heading: "Service unavailable",
      message: "The service is temporarily unavailable. Please try again later",
    });
  });

  it("does not expose unexpected exception messages", () => {
    const presentation = getErrorPresentation(
      new Error("Sensitive provider details"),
    );

    expect(presentation).toEqual({
      status: 500,
      heading: "Something went wrong",
      message: ERROR_MESSAGE_DEFAULT,
    });
    expect(presentation.message).not.toContain("Sensitive provider details");
  });
});
