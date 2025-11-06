import { randomBytes, scryptSync } from 'node:crypto'

export function hashPassword(passwd: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(passwd, salt, 64).toString('hex')

  return `${salt}:${hash}`
}

export function validatePassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':')
  const hashVerify = scryptSync(password, salt, 64).toString('hex')
  return hash === hashVerify
}
