import { check } from 'express-validator'
import { Router } from 'express'

import { getMovieListById, postMovieList, updateMovieList } from '../controllers/movieLists-controller'


export const movieList = Router()

movieList.get('/:id', getMovieListById)

movieList.post('/', [check('name').notEmpty(), check('description').isLength({ min: 5 })], postMovieList)

movieList.patch('/:id', [check('name').notEmpty(), check('description').isLength({ min: 5 })], updateMovieList)
