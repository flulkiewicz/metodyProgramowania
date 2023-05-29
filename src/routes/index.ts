import express from 'express'

import { movie } from './movie-routes'
import { movieList } from './movieList-routes'
import { user } from './user-routes'

export const routes = express.Router()

routes.use('/movies', movie)
routes.use('/movie-lists', movieList)
routes.use('/user', user)
