import { check } from 'express-validator';
import { getMovieById, postMovie } from '../controllers/movies-controller';
import { Router } from 'express';

export const movies = Router();


movies.get('/:id', getMovieById);


movies.post(
  '/',
  [check('name').notEmpty(), check('description').isLength({ min: 5 })],
  postMovie
);


