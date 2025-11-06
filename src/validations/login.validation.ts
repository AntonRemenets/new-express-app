import { z } from 'zod'

export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type LoginUserBody = z.infer<typeof LoginUserSchema>
