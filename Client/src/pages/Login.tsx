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
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Static credentials for demo
    if (email === 'demo@example.com' && password === 'password123') {
      // Simulate API call delay
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true')
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 2000,
        })
        navigate('/')
      }, 1000)
    } else {
      toast({
        title: 'Invalid credentials',
        description: 'Please use demo@example.com / password123',
        status: 'error',
        duration: 3000,
      })
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
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Text align="center" w="100%">
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