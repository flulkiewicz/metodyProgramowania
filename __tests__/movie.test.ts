import mongoose from "mongoose";
import Movie, { IMovie } from "../src/models/movie";

describe("Movie", () => {
  it("should create a new Movie instance with correct properties", () => {
    const name = "Inception";
    const description = "A mind-bending movie";
    const genre = "Thriller";
    const lists = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
    ];

    const movie: IMovie = new Movie({
      name,
      description,
      genre,
      lists,
    });

    expect(movie).toBeInstanceOf(Movie);
    expect(movie.name).toBe(name);
    expect(movie.description).toBe(description);
    expect(movie.genre).toBe(genre);
    expect(movie.lists).toEqual(lists);
  });
});
