import { Router } from 'express'
import {
  getAllUsers,
  getHello,
  registerUser,
} from '../controllers/user.controller'

const userRoutes = Router()

userRoutes.get('/hello', getHello)
userRoutes.get('/getAll', getAllUsers)
userRoutes.post('/register', registerUser)

export default userRoutes
