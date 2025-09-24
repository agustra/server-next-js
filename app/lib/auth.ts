import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode('demo-secret-key-12345')

export interface User {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  createdAt: Date
}

// In-memory storage untuk demo
export const users: User[] = [
  {
    id: 1,
    email: 'admin@demo.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date()
  },
  {
    id: 2,
    email: 'user@demo.com',
    password: 'user123',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    createdAt: new Date()
  }
]

export async function createToken(user: User) {
  return await new SignJWT({ 
    id: user.id, 
    email: user.email, 
    role: user.role 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export function findUserByEmail(email: string) {
  return users.find(user => user.email === email)
}

export function createUser(userData: Omit<User, 'id' | 'createdAt'>) {
  const newUser: User = {
    ...userData,
    id: users.length + 1,
    createdAt: new Date()
  }
  users.push(newUser)
  return newUser
}