import { BrowserRouter as Router } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import { Box, ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { AnimatePresence } from 'framer-motion'
import { TaskProvider } from './store/TaskContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <TaskProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Box minH="100vh" w="100vw" className="app-root">
                <DashboardLayout />
              </Box>
            </AnimatePresence>
          </Router>
        </TaskProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}
