import { z } from 'zod'

export const BlockUserSchema = z.object({
  userId: z.number().int().positive(),
})

export type BlockUserBody = z.infer<typeof BlockUserSchema>
