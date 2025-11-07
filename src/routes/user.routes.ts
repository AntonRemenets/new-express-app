import { Router } from 'express'
import {
  blockMe,
  blockUserById,
  getAllUsers,
  getHello,
  getMe,
  getUserById,
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
userRoutes.get('/getMe', authenticateJWT, getMe)
userRoutes.get(
  '/getUser/:id',
  authenticateJWT,
  requireRole('ADMIN'),
  getUserById,
)
userRoutes.post('/register', validate(RegisterUserSchema), registerUser)
userRoutes.post('/login', validate(LoginUserSchema), loginUser)
userRoutes.get('/blockMe', authenticateJWT, blockMe)
userRoutes.get(
  '/blockUser/:id',
  authenticateJWT,
  requireRole('ADMIN'),
  blockUserById,
)

export default userRoutes
