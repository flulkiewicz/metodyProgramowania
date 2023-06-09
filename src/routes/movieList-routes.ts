import { check } from 'express-validator'
import { Router } from 'express'

import { getMovieListById, postMovieList, updateMovieList, getMovieLists, deleteMovieList } from '../controllers/movieLists-controller'
import { authMiddleware } from '../middleware/auth'

export const movieList = Router()

movieList.use(authMiddleware)

movieList.get('/', getMovieLists)

movieList.get('/:id', getMovieListById)

movieList.post('/', [check('name').notEmpty(), check('description').isLength({ min: 5 })], postMovieList)

movieList.patch('/:id', [check('name').notEmpty(), check('description').isLength({ min: 5 })], updateMovieList)

movieList.delete('/:id', deleteMovieList)