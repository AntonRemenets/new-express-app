import { Router } from 'express'
import {
  getAllUsers,
  getHello,
  loginUser,
  registerUser,
} from '../controllers/user.controller'
import { validate } from '../middlewares/validation.middleware'
import { RegisterUserSchema } from '../validations/register.validation'
import { LoginUserSchema } from '../validations/login.validation'
import { authenticateJWT, requireRole } from '../middlewares/auth.middleware'

const userRoutes = Router()

userRoutes.get('/hello', getHello)
userRoutes.get('/getAll', authenticateJWT, requireRole('ADMIN'), getAllUsers)
userRoutes.post('/register', validate(RegisterUserSchema), registerUser)
userRoutes.post('/login', validate(LoginUserSchema), loginUser)

export default userRoutes
