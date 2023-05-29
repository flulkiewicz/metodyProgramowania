import { check } from 'express-validator'
import {
	addMovieToMovieList,
	deleteMovie,
	getMovieById,
	getMovies,
	postMovie,
	updateMovie,
} from '../controllers/movies-controller'
import { Router } from 'express'

export const movies = Router()

movies.get('/', getMovies)

movies.get('/:id', getMovieById)

movies.post('/', [check('name').notEmpty(), check('description').isLength({ min: 5 })], postMovie)

movies.post('/list', [check('movieListId').notEmpty(), check('movieId').notEmpty()], addMovieToMovieList)

movies.patch('/:id', [check('name').notEmpty(), check('description').isLength({ min: 5 })], updateMovie)

movies.delete('/:id', deleteMovie)
