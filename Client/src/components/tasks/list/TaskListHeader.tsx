import { Box, Flex, useColorModeValue } from '@chakra-ui/react'

interface TaskListHeaderProps {}

const TaskListHeader = ({}: TaskListHeaderProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box>
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
        align="center"
      >
        <Box flex="0 0 40px" textAlign="center">
          Done
        </Box>
        <Box flex={2} px={2}>
          Title
        </Box>
        <Box w="150px" px={2}>
          Project
        </Box>
        <Box w="120px" px={2}>
          Due Date
        </Box>
        <Box w="120px" px={2}>
          Assignee
        </Box>
        <Box w="40px" textAlign="center">
          Edit
        </Box>
      </Flex>
    </Box>
  )
}

export default TaskListHeader 