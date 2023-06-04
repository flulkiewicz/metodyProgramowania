import request from "supertest";
import express, { Router } from "express";

import { movie } from "../src/routes/movie-routes";
import { movieList } from "../src/routes/movieList-routes";
import { user } from "../src/routes/user-routes";

describe("Routes", () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();

    const router = Router();

    router.use("/movies", movie);
    router.use("/movie-lists", movieList);
    router.use("/user", user);

    app.use(router);
  });

  it("should handle GET /movies", async () => {
    const response = await request(app).get("/movies");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Movies route" });
  });

  it("should handle GET /movie-lists", async () => {
    const response = await request(app).get("/movie-lists");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Movie Lists route" });
  });

  it("should handle GET /user", async () => {
    const response = await request(app).get("/user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User route" });
  });
});
