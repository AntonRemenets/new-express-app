export interface UserModel {
  id: number
  firstName: string
  lastName: string
  middleName?: string
  email: string
  password: string
  role: string
  isActive: boolean
  dateOfBirth: string
  createdAt: Date
  updatedAt: Date
}
