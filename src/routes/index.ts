import express from "express";
import { movies } from "./movies-routes";

export const routes = express.Router();

routes.use("/movies", movies);
