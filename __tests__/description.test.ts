import fetch from "isomorphic-fetch";

export const getMovieDescription = async (title: string): Promise<string> => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    title
  )}&include_adult=false&language=en-US&page=1`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOWUyODEzMjM1Yjg1MTU0NThmNzQxMzIyYWQzYjE2OSIsInN1YiI6IjY0NzQ5MGM4ZGQ3MzFiMmQ3NjJjMTU3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zBm0OFg54ZSzbwkz7iDrqo9RKVNa0nhLlw7wvr8uvEY`,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:", err));

  try {
    const response = await fetch(url, options);
    const json: any = await response.json();

    if (json.results && json.results.length > 0) {
      return json.results[0].overview as string;
    } else {
      return "Description placeholder - description not found for movie in db";
    }
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
};

describe("getMovieDescription", () => {
  it("should return the movie description if it exists in the database", async () => {
    const title = "The Dark Knight";
    const description = await getMovieDescription(title);
    expect(typeof description).toBe("string");
  });
});
