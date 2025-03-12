import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const toast = useToast()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      await login(email, password)
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      // Navigation is handled in the login function
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error.message || 'An unexpected error occurred'
      setError(errorMessage)
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
        w="90%"
      >
        <VStack spacing={4} align="flex-start" w="100%">
          <Heading size="lg">Welcome Back</Heading>
          <Text color="gray.600">
            Please sign in to access your dashboard.
          </Text>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <VStack spacing={4} w="100%">
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Text align="center" w="100%" color="gray.600">
            Don't have an account?{' '}
            <Link as={RouterLink} to="/signup" color="blue.500">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}

export default Login 