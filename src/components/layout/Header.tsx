import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  HStack,
  VStack,
  Button,
  Icon,
  Divider,
  useColorModeValue,
  ButtonGroup,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  Text,
} from '@chakra-ui/react'
import {
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineSetting,
  AiOutlineUnorderedList,
  AiOutlineAppstore,
  AiOutlineCalendar,
  AiOutlineInbox,
  AiOutlineStar,
  AiOutlineFilter,
  AiOutlinePlus,
  AiOutlineCheck,
  AiOutlineFile,
} from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import { pageConfigs } from '../../config/pageConfig'
import { motion } from 'framer-motion'

const MotionFlex = motion(Flex)

interface HeaderProps {
  currentTab?: 'activity' | 'archived'
  onTabChange?: (tab: 'activity' | 'archived') => void
  viewType?: 'list' | 'board' | 'calendar' | 'files'
  onViewChange?: (view: 'list' | 'board' | 'calendar' | 'files') => void
}

export default function Header({ currentTab = 'activity', onTabChange, viewType = 'list', onViewChange }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPage = pageConfigs[location.pathname] || pageConfigs['/']

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const buttonHoverBg = useColorModeValue('gray.100', 'whiteAlpha.200')

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId as 'activity' | 'archived')
    }
  }

  const getViewIndex = (view: string) => {
    const views = ['list', 'board', 'calendar', 'files']
    return views.indexOf(view)
  }

  const handleViewTabChange = (index: number) => {
    const views = ['list', 'board', 'calendar', 'files']
    const newView = views[index] as 'list' | 'board' | 'calendar' | 'files'
    
    if (onViewChange) {
      onViewChange(newView)
      // Update URL based on view change
      if (newView === 'list') {
        navigate('/my_tasks/list')
      } else {
        navigate(`/my_tasks/${newView}`)
      }
    }
  }

  const renderPageActions = () => {
    switch (location.pathname) {
      case '/my_tasks':
      case '/my_tasks/list':
      case '/my_tasks/board':
      case '/my_tasks/calendar':
      case '/my_tasks/files':
        return (
          <VStack align="stretch" spacing={4}>
            <HStack spacing={4}>
              <Tabs 
                variant="line" 
                size="sm" 
                index={getViewIndex(viewType)}
                onChange={handleViewTabChange}
                flex={1}
                colorScheme="blue"
              >
                <TabList>
                  <Tab>
                    <HStack spacing={2}>
                      <Icon as={AiOutlineUnorderedList} />
                      <Text>List</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack spacing={2}>
                      <Icon as={AiOutlineAppstore} />
                      <Text>Board</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack spacing={2}>
                      <Icon as={AiOutlineCalendar} />
                      <Text>Calendar</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack spacing={2}>
                      <Icon as={AiOutlineFile} />
                      <Text>Files</Text>
                    </HStack>
                  </Tab>
                </TabList>
              </Tabs>
            </HStack>
          </VStack>
        )
      
      case '/inbox':
        return (
          <HStack spacing={4}>
            <ButtonGroup size="sm" isAttached variant="outline">
              <Tooltip label="Activity">
                <Button
                  leftIcon={<Icon as={AiOutlineInbox} />}
                  isActive={currentTab === 'activity'}
                  onClick={() => onTabChange?.('activity')}
                >
                  Activity
                </Button>
              </Tooltip>
              <Tooltip label="Archived">
                <Button
                  leftIcon={<Icon as={AiOutlineCheck} />}
                  isActive={currentTab === 'archived'}
                  onClick={() => onTabChange?.('archived')}
                >
                  Archived
                </Button>
              </Tooltip>
            </ButtonGroup>
          </HStack>
        )

      default:
        return null
    }
  }

  return (
    <Flex
      h="100%"
      px={6}
      align="center"
      justify="space-between"
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
    >
      {/* Left Section - Avatar, Title and Page Actions */}
      <MotionFlex
        align="center"
        gap={4}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Avatar size="sm" name="John Doe" src="/images/cat_img.png" />
        
        <VStack align="flex-start" spacing={3}>
          <Heading fontSize="xl">{currentPage.title}</Heading>
          {renderPageActions()}
        </VStack>
      </MotionFlex>

      {/* Right Section */}
      <HStack spacing={4}>
        {/* Search */}
        <InputGroup maxW="320px">
          <InputLeftElement pointerEvents="none">
            <Icon as={AiOutlineSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search..."
            variant="filled"
            bg="gray.100"
            fontSize="13px"
            _hover={{ bg: 'gray.200' }}
            _focus={{ bg: 'white', borderColor: 'blue.500' }}
          />
        </InputGroup>

        <Divider orientation="vertical" h="24px" />

        {/* Notifications */}
        <IconButton
          aria-label="Notifications"
          icon={<AiOutlineBell />}
          variant="ghost"
          fontSize="18px"
          color="gray.600"
        />

        {/* Settings */}
        <IconButton
          aria-label="Settings"
          icon={<AiOutlineSetting />}
          variant="ghost"
          fontSize="18px"
          color="gray.600"
        />

        {/* Profile */}
        <Menu>
          <MenuButton>
            <Avatar size="sm" name="John Doe" src="/images/cat_img.png" />
          </MenuButton>
          <MenuList fontSize="13px">
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem color="red.500">Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  )
} 