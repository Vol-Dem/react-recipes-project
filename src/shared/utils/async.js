export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      const error = new Error(`Request timed out after ${s} seconds`);
      error.name = "TimeoutError";
      reject(error);
    }, s * 1000);
  });
};
