import { NextFunction, Request, RequestHandler, Response } from 'express'
import prisma from '../services/prisma.service'
import { UserModel } from '../generated/prisma/models/User'
import { RegisterUserBody } from '../validations/register.validation'
import { hashPassword, validatePassword } from '../utils/password.util'
import jwt from 'jsonwebtoken'
import { LoginUserBody } from '../validations/login.validation'

export const getHello: RequestHandler = (req, res) => {
  res.status(200).json({ message: 'Hello from user controller' })
}

// Получение списка пользователей
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users: UserModel[] = await prisma.user.findMany()

    res.status(200).json({ data: users })
  } catch (error) {
    next(error)
  }
}

// Регистрация пользователя
export const registerUser = async (
  req: Request<unknown, unknown, RegisterUserBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      role,
    } = req.body
    const candidate: UserModel | null = await prisma.user.findUnique({
      where: { email: req.body.email },
    })

    if (candidate) {
      return res.status(400).json({
        message: 'User with this email already exists',
      })
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword(password),
        firstName,
        lastName,
        middleName,
        dateOfBirth,
        role,
      },
    })

    res
      .status(201)
      .json({ message: 'User registered successfully', data: { user } })
  } catch (error) {
    next(error)
  }
}

// Авторизация пользователя
export const loginUser = async (
  req: Request<unknown, unknown, LoginUserBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body
    const user: UserModel | null = await prisma.user.findFirst({
      where: { email },
    })

    if (!user || !validatePassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const payload = { userId: user.id, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })

    return res
      .status(200)
      .json({ message: 'User logged in successfully', data: { token } })
  } catch (error) {
    next(error)
  }
}

// Получение пользователя по ID
// либо админ, либо пользователь сам себя
export const getUserById = async () => {}

// Блокировка пользователя
// либо админ, либо пользователь сам себя
export const blockUser = async () => {}
