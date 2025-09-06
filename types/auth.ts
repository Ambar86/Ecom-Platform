// TypeScript interfaces for authentication

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
