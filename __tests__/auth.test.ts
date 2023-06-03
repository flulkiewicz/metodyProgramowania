import { authMiddleware } from "../src/middleware/auth";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../src/models/http-error";

interface CustomRequest extends Request {
  userData?: { userId: string };
}

describe("authMiddleware", () => {
  let req: CustomRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as CustomRequest;
    res = {} as Response;
    next = jest.fn() as NextFunction;
  });

  it("should call next() if token exists and is valid", () => {
    // Arrange
    const token = "valid_token";
    req.headers = {
      authorization: `Bearer ${token}`,
    };
    const decodedToken = {
      userId: "user_id",
    };
    jwt.verify = jest.fn().mockReturnValue(decodedToken);

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      "jwt_constellation_app_token"
    );
    expect(req.userData).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 error if token is missing", () => {
    // Arrange
    req.headers = {};

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(new HttpError("Auth failed.", 401));
  });

  it("should return 401 error if token is invalid", () => {
    // Arrange
    const token = "invalid_token";
    req.headers = {
      authorization: `Bearer ${token}`,
    };
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      "jwt_constellation_app_token"
    );
    expect(next).toHaveBeenCalledWith(new HttpError("Auth failed.", 401));
  });
});
