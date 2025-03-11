import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import { Box, ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { AnimatePresence } from 'framer-motion'
import { TaskProvider } from './store/TaskContext'
import { AuthProvider } from './store/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { useAuth } from './store/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}

// Auth Layout component
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minH="100vh" w="100vw" bg="gray.50">
      {children}
    </Box>
  )
}

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <AuthLayout>
              <Login />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <TaskProvider>
              <AnimatePresence mode="wait">
                <AppRoutes />
              </AnimatePresence>
            </TaskProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
