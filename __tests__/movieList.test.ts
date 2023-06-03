import mongoose from "mongoose";
import MovieList, { IMovieList } from "../src/models/movieList";

describe("MovieList", () => {
  it("should create an instance of MovieList with correct properties", () => {
    // Przygotowanie danych testowych
    const name = "My Movie List";
    const description = "A list of my favorite movies";
    const genre = "Action";
    const user = new mongoose.Types.ObjectId();
    const movies = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
    ];

    // Tworzenie instancji MovieList
    const movieList: IMovieList = new MovieList({
      name: name,
      description: description,
      user: user,
      movies: movies,
    });

    // Sprawdzenie oczekiwanych wartości
    expect(movieList).toBeInstanceOf(MovieList);
    expect(movieList.name).toBe(name);
    expect(movieList.description).toBe(description);
    expect(movieList.user).toEqual(user);
    expect(movieList.movies).toEqual(movies);
  });
});
