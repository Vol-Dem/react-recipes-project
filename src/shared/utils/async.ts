export const timeout = function (seconds: number): Promise<Response> {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      const error = new Error(`Request timed out after ${seconds} seconds`);
      error.name = "TimeoutError";
      reject(error);
    }, seconds * 1000);
  });
};
