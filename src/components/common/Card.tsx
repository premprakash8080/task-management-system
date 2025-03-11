import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface CardProps extends BoxProps {
  isHoverable?: boolean
}

export const Card = ({ children, isHoverable = false, ...props }: CardProps) => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.100', 'gray.700')

  return (
    <MotionBox
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="card"
      transition="all 0.2s"
      _hover={isHoverable ? {
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      } : undefined}
      {...props}
    >
      {children}
    </MotionBox>
  )
} 