import HttpError from "../src/models/http-error";

describe("HttpError", () => {
  it("should create an instance of HttpError with correct properties", () => {
    const message = "Internal Server Error";
    const errorCode = 500;

    const error = new HttpError(message, errorCode);

    expect(error).toBeInstanceOf(HttpError);
    expect(error.message).toBe(message);
    expect(error.code).toBe(errorCode);
  });
});
