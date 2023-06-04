import request from "supertest";
import { app } from "../src/app";

describe("App Setup", () => {
  it("should configure app and listen on port 5000", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(404);
  });
});
