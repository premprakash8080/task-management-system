import { BrowserRouter as Router } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import { Box, ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { AnimatePresence } from 'framer-motion'

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AnimatePresence mode="wait">
          <Box minH="100vh" w="100vw" className="app-root">
            <DashboardLayout />
          </Box>
        </AnimatePresence>
      </Router>
    </ChakraProvider>
  )
}
