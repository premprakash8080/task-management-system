import {
  IconButton,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react'
import { AiOutlineSetting } from 'react-icons/ai'
import CustomizePanel from './CustomizePanel'

const CustomizeButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Tooltip label="Customize view">
        <IconButton
          icon={<AiOutlineSetting />}
          variant="ghost"
          size="sm"
          aria-label="Customize view"
          onClick={onOpen}
        />
      </Tooltip>

      <CustomizePanel 
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}

export default CustomizeButton 