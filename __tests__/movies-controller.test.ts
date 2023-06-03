import { Request, Response, NextFunction } from "express";
import { getMovieById } from "../src/controllers/movies-controller";
import Movie from "../src/models/movie";

jest.mock("../src/models/movie");

describe("getMovieById", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {
      params: {
        id: "12345",
      },
    };
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should respond with the correct movie", async () => {
    const movieData = {
      _id: "12345",
      name: "Movie 1",
      genre: "Action",
      toObject: jest.fn().mockReturnThis(),
    };

    const movieMock = Movie as jest.Mocked<typeof Movie>;
    movieMock.findById.mockResolvedValueOnce(movieData as any);

    await getMovieById(req as Request, res as Response, next);

    expect(movieMock.findById).toHaveBeenCalledWith("12345");
    expect(movieData.toObject).toHaveBeenCalledWith({ getters: true });
    expect(res.json).toHaveBeenCalledWith({
      movie: movieData,
    });
  });

  it("should handle error when movie is not found", async () => {
    const movieMock = Movie as jest.Mocked<typeof Movie>;
    movieMock.findById.mockResolvedValueOnce(null);

    await getMovieById(req as Request, res as Response, next);

    expect(movieMock.findById).toHaveBeenCalledWith("12345");
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should handle error when there is an exception", async () => {
    const movieMock = Movie as jest.Mocked<typeof Movie>;
    movieMock.findById.mockRejectedValueOnce(new Error("Database error"));

    await getMovieById(req as Request, res as Response, next);

    expect(movieMock.findById).toHaveBeenCalledWith("12345");
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
