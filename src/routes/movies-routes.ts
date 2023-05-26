import { check } from 'express-validator';
import { deleteMovie, getMovieById, postMovie, updateMovie } from '../controllers/movies-controller';
import { Router } from 'express';

export const movies = Router();


movies.get('/:id',
 getMovieById
 );


movies.post(
  '/',
  [check('name').notEmpty(), check('description').isLength({ min: 5 })],
  postMovie
);

movies.patch(
  '/:id',
  [check('name').notEmpty(), check('description').isLength({ min: 5 })],
  updateMovie
);

movies.delete(
  '/:id',
  deleteMovie
);


