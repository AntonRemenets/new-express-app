import { z } from 'zod'

export const RegisterUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  role: z.enum(['ADMIN', 'USER']).default('USER').optional(),
  dateOfBirth: z.string(),
})

export type RegisterUserBody = z.infer<typeof RegisterUserSchema>
