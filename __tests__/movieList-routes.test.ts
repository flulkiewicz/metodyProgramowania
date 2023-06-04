import request from "supertest";
import { check } from "express-validator";
import { Router, Express, json } from "express";
import express from "express";

import {
  getMovieListById,
  postMovieList,
  updateMovieList,
} from "../src/controllers/movieLists-controller";
import { authMiddleware } from "../src/middleware/auth";

describe("Movie List Routes", () => {
  let app: Express;

  beforeAll(() => {
    const router = Router();

    router.use(authMiddleware);

    router.get("/:id", getMovieListById);

    router.post(
      "/",
      [check("name").notEmpty(), check("description").isLength({ min: 5 })],
      postMovieList
    );

    router.patch(
      "/:id",
      [check("name").notEmpty(), check("description").isLength({ min: 5 })],
      updateMovieList
    );

    app = express();
    app.use(json());
    app.use(router);
  });

  it("should handle GET /:id", async () => {
    const response = await request(app).get("/123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "123", name: "Movie List 123" });
  });

  it("should handle POST /", async () => {
    const response = await request(app).post("/").send({
      name: "Test Movie List",
      description: "This is a test movie list",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "456", name: "Test Movie List" });
  });

  it("should handle PATCH /:id", async () => {
    const response = await request(app).patch("/123").send({
      name: "Updated Movie List",
      description: "This is an updated movie list",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "123", name: "Updated Movie List" });
  });
});
