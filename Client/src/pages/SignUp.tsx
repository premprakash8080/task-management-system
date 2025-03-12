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

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const toast = useToast()
  const { signup } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await signup(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName
      )
      toast({
        title: 'Account created successfully',
        description: 'Welcome to Task Management System',
        status: 'success',
        duration: 3000,
      })
      navigate('/')
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.')
      toast({
        title: 'Registration failed',
        description: error.message || 'Please check your information and try again',
        status: 'error',
        duration: 3000,
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
          <Heading size="lg">Create Account</Heading>
          <Text color="gray.600">
            Sign up to start managing your tasks effectively.
          </Text>

          <form onSubmit={handleSignUp} style={{ width: '100%' }}>
            <VStack spacing={4} w="100%">
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                isLoading={isLoading}
              >
                Sign Up
              </Button>
            </VStack>
          </form>

          <Text align="center" w="100%">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="blue.500">
              Sign in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}

export default SignUp 