import {
  Box,
  Container,
  useBreakpointValue,
  BoxProps,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface PageLayoutProps extends BoxProps {
  maxWidth?: string | string[]
  isAnimated?: boolean
}

export const PageLayout = ({
  children,
  maxWidth = ['100%', '100%', '8xl'],
  isAnimated = true,
  ...props
}: PageLayoutProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const content = (
    <Box
      w="full"
      px={[4, 6, 8]}
      py={[4, 6]}
      {...props}
    >
      <Container maxW={maxWidth} px={0}>
        {children}
      </Container>
    </Box>
  )

  if (!isAnimated) return content

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </MotionBox>
  )
} 