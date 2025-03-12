import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authApi, { AuthResponse } from '../services/api/auth'
import axios from 'axios'

interface AuthContextType {
  isAuthenticated: boolean
  user: AuthResponse['user'] | null
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')

        // If no tokens exist, just set not authenticated without error
        if (!accessToken || !refreshToken || !storedUser) {
          setIsAuthenticated(false)
          setUser(null)
          setIsLoading(false)
          return
        }

        // If we have valid tokens and user data, set the auth state
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
          
          // Set axios default header with current access token
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

          // Only refresh token if it's close to expiring
          const tokenData = parseJwt(accessToken)
          const isTokenExpiringSoon = tokenData.exp * 1000 - Date.now() < 5 * 60 * 1000 // 5 minutes

          if (isTokenExpiringSoon) {
            try {
              const result = await authApi.refreshToken(refreshToken)
              if (result.accessToken) {
                localStorage.setItem('accessToken', result.accessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${result.accessToken}`
              }
            } catch (refreshError) {
              console.warn('Token refresh failed:', refreshError)
              // Continue with current token if refresh fails
            }
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          // Clear invalid data
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          setIsAuthenticated(false)
          setUser(null)
          
          if (!window.location.pathname.includes('/login')) {
            navigate('/login', { replace: true })
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [navigate])

  // Helper function to parse JWT token
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      
      if (!response.accessToken || !response.refreshToken || !response.user) {
        throw new Error('Invalid login response')
      }

      // Store auth data
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Update state
      setUser(response.user)
      setIsAuthenticated(true)
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`
      
      // Navigate to home
      navigate('/', { replace: true })
    } catch (error: any) {
      console.error('Login failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setUser(null)
      throw error
    }
  }

  const signup = async (username: string, email: string, password: string, fullName: string) => {
    try {
      const response = await authApi.signup({ username, email, password, fullName })
      if (!response.accessToken || !response.refreshToken) {
        throw new Error('Invalid signup response')
      }
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      setUser(response.user)
      setIsAuthenticated(true)
      navigate('/')
    } catch (error) {
      console.error('Signup failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear all auth data
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
      setIsAuthenticated(false)
      navigate('/login', { replace: true })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 