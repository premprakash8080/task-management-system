import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
} from '@chakra-ui/react'
import { 
  AiOutlineMore,
  AiOutlineCalendar,
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlinePrinter,
} from 'react-icons/ai'

const MoreActionMenu = () => {
  return (
    <Menu>
      <Tooltip label="More actions">
        <MenuButton
          as={IconButton}
          icon={<AiOutlineMore />}
          variant="ghost"
          size="sm"
          aria-label="More actions"
        />
      </Tooltip>
      <MenuList>
        <MenuItem icon={<AiOutlineCalendar />}>
          Set due dates
        </MenuItem>
        <MenuItem icon={<AiOutlineExport />}>
          Export tasks
        </MenuItem>
        <MenuItem icon={<AiOutlinePrinter />}>
          Print list
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<AiOutlineDelete />} color="red.500">
          Delete completed tasks
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default MoreActionMenu 