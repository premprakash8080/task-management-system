import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface IncompleteTasksMenuProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

const IncompleteTasksMenu = ({ currentTab, onTabChange }: IncompleteTasksMenuProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button 
          size="sm" 
          rightIcon={<ChevronDownIcon />} 
          variant="outline"
        >
          {currentTab === 'active' ? 'Incomplete Tasks' : 
           currentTab === 'done' ? 'Completed Tasks' : 'All Tasks'}
        </Button>
      </PopoverTrigger>

      <PopoverContent w="150px">
        <PopoverBody>
          <VStack align="start" spacing={2}>
            <Text 
              cursor="pointer" 
              onClick={() => onTabChange?.('active')}
            >
              Incomplete Tasks
            </Text>
            <Text 
              cursor="pointer" 
              onClick={() => onTabChange?.('done')}
            >
              Completed Tasks
            </Text>
            <Text 
              cursor="pointer" 
              onClick={() => onTabChange?.('all')}
            >
              All Tasks
            </Text>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default IncompleteTasksMenu;
