export type User = {
  id: number
  name: string
  email: string
}

export type Login = {
  email: string
  password: string
}

export type Register = {
  name: string
  email: string
  password: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
}

export type LoginFormState = {
  email: string
  password: string
}

export type SignupFormState = {
  fullname: string
  email: string
  password: string
  confirmPassword: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken: string
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
}

export type RegisterResponse = {
  email: string
  name: string
  role: string
  permissions: string[]
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}
