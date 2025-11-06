import { NextFunction, Request, RequestHandler, Response } from 'express'
import prisma from '../services/prisma.service'
import { UserModel } from '../generated/prisma/models/User'
import { z } from 'zod'
import { randomBytes, scryptSync } from 'node:crypto'

export const getHello: RequestHandler = (req, res) => {
  res.status(200).json({ message: 'Hello from user controller' })
}

const RegisterUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  role: z.enum(['ADMIN', 'USER']).default('USER').optional(),
  dateOfBirth: z.string(),
})

type RegisterUserBody = z.infer<typeof RegisterUserSchema>

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
    const validatedData = RegisterUserSchema.parse(req.body)
    const candidate = await prisma.user.findUnique({
      where: { email: req.body.email },
    })

    if (candidate) {
      return res.status(400).json({
        message: 'User with this email already exists',
      })
    }

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashPassword(validatedData.password),
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        middleName: validatedData.middleName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        role: validatedData.role,
      },
    })

    res
      .status(201)
      .json({ message: 'User registered successfully', data: user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }

    next(error)
  }
}

// Авторизация пользователя

// Получение пользователя по ID

// Блокировка пользователя

function hashPassword(passwd: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(passwd, salt, 64).toString('hex')

  return `${salt}:${hash}`
}

function validatePassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  const hashVerify = scryptSync(password, salt, 64).toString('hex')
  return hash === hashVerify
}
