import { check } from 'express-validator'
import { Router } from 'express'

import {
	addMovieToMovieList,
	deleteMovie,
	getMovieById,
	getMovies,
	postMovie,
	updateMovie,
} from '../controllers/movies-controller'
import { authMiddleware } from '../middleware/auth'

export const movie = Router()


movie.get('/', getMovies)

movie.get('/:id', getMovieById)

movie.use(authMiddleware)

movie.post('/', [check('name').notEmpty()], postMovie)

movie.post('/list', [check('movieListId').notEmpty(), check('movieId').notEmpty()], addMovieToMovieList)

movie.patch('/:id', [check('name').notEmpty(), check('description').isLength({ min: 5 })], updateMovie)

movie.delete('/:id', deleteMovie)
