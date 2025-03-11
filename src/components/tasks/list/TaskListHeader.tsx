import { Box, Flex, useColorModeValue } from '@chakra-ui/react'

const TaskListHeader = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Flex
      px={3}
      py={2}
      color={textColor}
      fontSize="sm"
      fontWeight="medium"
      borderBottom="1px solid"
      borderTop="1px solid"
      borderColor={borderColor}
      bg={bgColor}
      borderRadius="md"
      boxShadow="sm"
      mb={2}
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Box flex="0 0 40px" /> {/* Checkbox space */}
      <Box
        flex={2}
        borderRight="1px solid"
        borderColor={borderColor}
        px={2}
        cursor="pointer"
        _hover={{ color: 'gray.900' }}
      >
        Task Name
      </Box>

      <Box
        flex={1}
        borderRight="1px solid"
        borderColor={borderColor}
        px={2}
        cursor="pointer"
        _hover={{ color: 'gray.900' }}
      >
        Due Date
      </Box>

      <Box
        w="200px"
        borderRight="1px solid"
        borderColor={borderColor}
        px={2}
        cursor="pointer"
        _hover={{ color: 'gray.900' }}
      >
        Project
      </Box>

      <Box
        w="120px"
        px={2}
        cursor="pointer"
        _hover={{ color: 'gray.900' }}
      >
        Tags
      </Box>
    </Flex>
  )
}

export default TaskListHeader 