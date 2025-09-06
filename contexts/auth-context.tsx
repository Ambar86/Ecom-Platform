"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authApi, apiClient } from "@/lib/api-client"
import type { AuthState } from "@/types/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          setState((prev) => ({ ...prev, isLoading: false }))
          return
        }

        // Verify token is still valid
        const response = await authApi.verifyToken(token)
        if (response.valid) {
          apiClient.setToken(token)

          // Get user data
          const userResponse = await authApi.getMe()
          setState({
            user: userResponse.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          // Token is invalid, clear it
          localStorage.removeItem("auth_token")
          setState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        localStorage.removeItem("auth_token")
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })

      // Store token
      localStorage.setItem("auth_token", response.token)
      apiClient.setToken(response.token)

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await authApi.signup({ email, password, name })

      // Store token
      localStorage.setItem("auth_token", response.token)
      apiClient.setToken(response.token)

      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    apiClient.setToken("")

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const refreshUser = async () => {
    try {
      if (!state.token) return

      const response = await authApi.getMe()
      setState((prev) => ({
        ...prev,
        user: response.user,
      }))
    } catch (error) {
      console.error("Refresh user error:", error)
      logout()
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
