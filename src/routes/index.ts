import express from 'express'
import { movies } from './movies-routes'
import { movieLists } from './movieLists-routes'

export const routes = express.Router()

routes.use('/movies', movies)
routes.use('/movie-lists', movieLists)
