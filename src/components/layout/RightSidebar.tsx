import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Flex,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface RightSidebarProps {
  isOpen: boolean
  onClose: () => void
  title: React.ReactNode
  children: React.ReactNode
  width?: string
  headerContent?: React.ReactNode
}

const MotionDrawerContent = motion(DrawerContent)

const RightSidebar = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = '50%',
  headerContent 
}: RightSidebarProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const drawerWidth = isMobile ? '100%' : width

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="full"
      isFullHeight
    >
      <DrawerOverlay />
      <AnimatePresence>
        {isOpen && (
          <MotionDrawerContent
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            maxW={drawerWidth}
            mx="auto"
          >
            <DrawerCloseButton 
              size="lg"
              top={4}
              right={4}
              zIndex="overlay"
            />
            <Flex direction="column" h="100vh">
              <Box>
                <DrawerHeader 
                  borderBottomWidth="1px" 
                  bg="white" 
                  position="sticky"
                  top={0}
                  zIndex="sticky"
                  px={6}
                  py={4}
                >
                  {title}
                </DrawerHeader>
                {headerContent && (
                  <Box 
                    borderBottomWidth="1px"
                    bg="white"
                    position="sticky"
                    top="72px"
                    zIndex="sticky"
                    px={6}
                    py={4}
                  >
                    {headerContent}
                  </Box>
                )}
              </Box>
              <DrawerBody 
                p={0} 
                flex={1} 
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'gray.200',
                    borderRadius: '24px',
                  },
                }}
              >
                {children}
              </DrawerBody>
            </Flex>
          </MotionDrawerContent>
        )}
      </AnimatePresence>
    </Drawer>
  )
}

export default RightSidebar 