import { check } from 'express-validator'
import { getMovieListById, postMovieList, updateMovieList } from '../controllers/movieLists-controller'
import { Router } from 'express'

export const movieLists = Router()

movieLists.get('/:id', getMovieListById)

movieLists.post('/', [check('name').notEmpty(), check('description').isLength({ min: 5 })], postMovieList)

movieLists.patch('/:id', [check('name').notEmpty(), check('description').isLength({ min: 5 })], updateMovieList)
