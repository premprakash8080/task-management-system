import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from '@chakra-ui/react';
import { AiOutlineSortAscending } from 'react-icons/ai';

interface SortMenuProps {
  onSortChange?: (sortBy: string) => void;
}

const SortMenu = ({ onSortChange }: SortMenuProps) => {
  return (
    <Menu>
      <Tooltip label="Sort by">
        <MenuButton
          as={Button}
          leftIcon={<AiOutlineSortAscending />}
          variant="ghost"
          size="sm"
          aria-label="Sort by"
        >
          Sort
        </MenuButton>
      </Tooltip>
      <MenuList>
        <MenuItem onClick={() => onSortChange?.('none')}>
          None
        </MenuItem>
        <MenuItem onClick={() => onSortChange?.('dueDate')}>
          Due Date
        </MenuItem>
        <MenuItem onClick={() => onSortChange?.('likes')}>
          Likes
        </MenuItem>
        <MenuItem onClick={() => onSortChange?.('alphabetical')}>
          Alphabetical
        </MenuItem>
        <MenuItem onClick={() => onSortChange?.('projects')}>
          Projects
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default SortMenu;
