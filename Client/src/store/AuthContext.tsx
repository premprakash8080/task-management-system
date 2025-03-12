import React, { createContext, useReducer, useCallback, ReactNode, useContext } from 'react'
import { User } from '../types/task'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

type AuthAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null
      }
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // TODO: Implement actual login logic with your API
      const mockUser: User = {
        _id: '1',
        email
      }
      dispatch({ type: 'SET_USER', payload: mockUser })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const logout = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // TODO: Implement actual logout logic with your API
      dispatch({ type: 'CLEAR_USER' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Logout failed' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // TODO: Implement actual registration logic with your API
      const mockUser: User = {
        _id: '1',
        email
      }
      dispatch({ type: 'SET_USER', payload: mockUser })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 