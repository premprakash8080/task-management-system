import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  forwardRef,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionButton = motion(ChakraButton)

export interface ButtonProps extends ChakraButtonProps {
  isAnimated?: boolean
}

export const Button = forwardRef<ButtonProps, 'button'>(
  ({ children, isAnimated = true, ...props }, ref) => {
    const buttonProps = {
      ref,
      position: 'relative',
      transition: 'all 0.2s',
      _hover: {
        transform: 'translateY(-1px)',
        ...props._hover,
      },
      _active: {
        transform: 'translateY(0)',
        ...props._active,
      },
      ...props,
    }

    if (!isAnimated) {
      return <ChakraButton {...buttonProps}>{children}</ChakraButton>
    }

    return (
      <MotionButton
        {...buttonProps}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </MotionButton>
    )
  }
) 