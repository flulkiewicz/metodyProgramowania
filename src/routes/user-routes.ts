import { Router } from 'express'

import { getUser, getUsers, signup, login } from '../controllers/users-controller'

export const user = Router()

user.get('/:id', getUser)

user.get('/', getUsers)

user.post('/signup', signup)

user.post('login', login)