import { check } from 'express-validator'
import { Router } from 'express'

import { getUser, getUsers, signup, login } from '../controllers/users-controller'
import { authMiddleware } from '../middleware/auth'

export const user = Router()

user.post('/signup',
 [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })

], signup)

user.post('/login', login)

user.use(authMiddleware)

user.get('/:id', getUser)

user.get('/', getUsers)