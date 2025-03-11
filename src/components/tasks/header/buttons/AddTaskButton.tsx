import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
} from '@chakra-ui/react'
import { AiOutlinePlus } from 'react-icons/ai'

const AddTaskButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle task creation logic here
    onClose()
  }

  return (
    <>
      <Button
        leftIcon={<AiOutlinePlus />}
        colorScheme="blue"
        size="sm"
        onClick={onOpen}
      >
        Add Task
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input placeholder="Task title" />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Task description" />
                </FormControl>

                <HStack justify="flex-end" pt={4}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button colorScheme="blue" type="submit">
                    Create Task
                  </Button>
                </HStack>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddTaskButton 