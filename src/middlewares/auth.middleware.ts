import type { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthUser {
  userId: number
  role: 'ADMIN' | 'USER'
}
export interface AuthRequest extends Request {
  user?: AuthUser
}

export function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = extractTokenFromHeader(req)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as AuthUser | undefined

    next()
  } catch (err) {
    //console.log(err)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export function requireRole(...roles: Array<'ADMIN' | 'USER'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}

function extractTokenFromHeader(req: Request): string | undefined {
  const [type, token] = req.headers.authorization?.split(' ') ?? []

  return type === 'Bearer' ? token : undefined
}
