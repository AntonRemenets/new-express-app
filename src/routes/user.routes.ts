import { Router } from 'express'
import {
  getAllUsers,
  getHello,
  loginUser,
  registerUser,
} from '../controllers/user.controller'
import { validate } from '../middlewares/validation.middleware'
import { RegisterUserSchema } from '../validations/register.validation'

const userRoutes = Router()

userRoutes.get('/hello', getHello)
userRoutes.get('/getAll', getAllUsers)
userRoutes.post('/register', validate(RegisterUserSchema), registerUser)
userRoutes.post('/login', loginUser)

export default userRoutes
