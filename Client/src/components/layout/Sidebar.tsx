import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Divider,
  useColorModeValue,
  BoxProps,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Avatar,
  AvatarGroup,
  Wrap,
  WrapItem,
  Menu,
  MenuButton,
  Flex,
} from '@chakra-ui/react'
import {
  AiOutlineHome,
  AiOutlineInbox,
  AiOutlineFolder,
  AiOutlineFlag,
  AiOutlineStar,
  AiOutlineTeam,
  AiOutlinePlus,
  AiOutlineMenu,
  AiOutlineDelete,
  AiOutlineSearch,
  AiOutlineMore,
} from 'react-icons/ai'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import ProjectTaskPanel from '../projects/ProjectTaskPanel'
import { Project } from '../../types/project'
import { Task } from '../../types/task'
import { useQuery } from '@tanstack/react-query'
import projectsApi from '../../services/api/projects'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)

// Constants
const MAX_WIDTH = '240px'
const MIN_WIDTH = '56px'
const TRANSITION_DURATION = 0.2

interface NavItemProps {
  icon?: any
  label: string
  to: string
  count?: number
  isCollapsed?: boolean
}

const NavItem = ({ icon, label, to, count, isCollapsed }: NavItemProps) => {
  const location = useLocation()
  const isActive = location.pathname === to
  const activeBg = useColorModeValue('gray.100', 'whiteAlpha.100')
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const color = useColorModeValue('gray.700', 'whiteAlpha.900')

  return (
    <Box 
      as="li" 
      className="css-0"
      listStyleType="none"
      role="group"
    >
      <Box
        as={RouterLink}
        to={to}
        display="flex"
        alignItems="center"
        justifyContent={isCollapsed ? "center" : "flex-start"}
        px={2.5}
        py={2}
        color={color}
        className="css-cblimx"
        data-discover="true"
        _hover={{
          bg: hoverBg,
          color: isActive ? 'brand.600' : 'brand.500',
        }}
        bg={isActive ? activeBg : 'transparent'}
        borderRadius="md"
        title={isCollapsed ? label : undefined}
        transition="all 0.2s"
        position="relative"
      >
        <Icon 
          as={icon} 
          boxSize={5} 
          mr={isCollapsed ? 0 : 3}
          className="chakra-icon css-8nmnjd"
          color={isActive ? 'brand.500' : 'inherit'}
          transition="all 0.2s"
        />
        {!isCollapsed && (
          <>
            <Text 
              fontSize="sm"
              className="chakra-text css-itvw0n"
              fontWeight={isActive ? "medium" : "normal"}
              transition="all 0.2s"
            >
              {label}
            </Text>
            {count !== undefined && (
              <Box
                ml="auto"
                px={2}
                py={0.5}
                borderRadius="full"
                bg={isActive ? 'brand.500' : 'gray.200'}
                color={isActive ? 'white' : 'gray.600'}
                fontSize="xs"
                fontWeight="medium"
                transition="all 0.2s"
                _groupHover={{
                  bg: 'brand.500',
                  color: 'white',
                }}
              >
                {count}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

interface ProjectItemProps {
  name: string
  color: string
  to: string
  isActive?: boolean
  isCollapsed?: boolean
  onProjectSelect?: (projectId: string) => void
  projectId: string
}

const ProjectItem = ({
  name,
  color,
  to,
  isActive,
  isCollapsed,
  onProjectSelect,
  projectId
}: ProjectItemProps) => {
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const activeBg = useColorModeValue('gray.100', 'whiteAlpha.100')
  const location = useLocation()

  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onProjectSelect?.(projectId)
  }

  return (
    <Box
      as={RouterLink}
      to={to}
      display="flex"
      alignItems="center"
      justifyContent={isCollapsed ? "center" : "flex-start"}
      px={2.5}
      py={2}
      _hover={{
        bg: hoverBg,
      }}
      bg={isActive ? activeBg : 'transparent'}
      borderRadius="md"
      title={isCollapsed ? name : undefined}
      transition="all 0.2s"
      role="group"
      position="relative"
      onClick={handleProjectClick}
    >
      <HStack 
        w="full" 
        spacing={isCollapsed ? 0 : 3} 
        justifyContent={isCollapsed ? "center" : "flex-start"}
      >
        <Box 
          w="2.5" 
          h="2.5" 
          bg={color} 
          borderRadius="sm" 
          flexShrink={0}
          transition="all 0.2s"
        />
        {!isCollapsed && (
          <>
            <Text 
              fontSize="sm" 
              flex="1"
              transition="all 0.2s"
              fontWeight={isActive ? "medium" : "normal"}
              color={isActive ? 'gray.900' : 'gray.700'}
              _groupHover={{ color: 'gray.900' }}
            >
              {name}
            </Text>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<AiOutlineMore />}
                variant="ghost"
                size="sm"
                aria-label="More options"
                opacity={0}
                _groupHover={{ opacity: 0.75 }}
                _hover={{ opacity: 1, bg: 'gray.100' }}
                transition="all 0.2s"
                onClick={(e) => e.stopPropagation()}
              />
            </Menu>
          </>
        )}
      </HStack>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({
  onCollapse,
  ...props
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Fetch projects using React Query
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const result = await projectsApi.getProjects();
        console.log('Fetched projects:', result);
        return result;
      } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })

  const activeProjects = projects.filter(project => {
    const isActive = project?.status === 'active' || !project?.status;
    console.log(`Project ${project?.id}: status=${project?.status}, isActive=${isActive}`);
    return isActive;
  });

  const handleToggle = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapse?.(newCollapsed)
  }

  const handleProjectSelect = (projectId: string) => {
    console.log('Project selected:', projectId);
    if (!projectId) {
      console.error('Invalid project ID');
      return;
    }
    
    // Find the project to verify it exists
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      return;
    }
    
    console.log('Navigating to project:', project);
    navigate(`/projects/${projectId}/tasks`);
  }

  // Update ProjectItem usage in both collapsed and expanded views
  const renderProjectItem = (project: Project) => {
    if (!project?.id) {
      console.warn('Invalid project data:', project);
      return null;
    }
    
    return (
      <ProjectItem
        key={project.id}
        name={project.title}
        color={project.color || '#CBD5E0'} // Provide fallback color
        to={`/projects/${project.id}/tasks`}
        isActive={location.pathname.startsWith(`/projects/${project.id}`)}
        isCollapsed={isCollapsed}
        onProjectSelect={handleProjectSelect}
        projectId={project.id}
      />
    );
  };

  return (
    <>
      <MotionFlex
        as="nav"
        h="100vh"
        bg={useColorModeValue('white', 'gray.800')}
        borderRight="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        initial={false}
        animate={{
          width: isCollapsed ? MIN_WIDTH : MAX_WIDTH
        }}
        transition={{
          duration: TRANSITION_DURATION,
          ease: "easeInOut"
        }}
        flexDirection="column"
        position="fixed"
        top={0}
        left={0}
        bottom={0}
        zIndex={10}
        overflow="hidden"
        {...props}
      >
        {/* Fixed Header */}
        <Box flexShrink={0}>
          <HStack px={2.5} py={3} justify="space-between">
            <Box
              as={RouterLink}
              to="/"
              overflow="hidden"
              whiteSpace="nowrap"
              display="flex"
              alignItems="center"
            >
              {!isCollapsed && (
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  transition={`all ${TRANSITION_DURATION}s`}
                  opacity={isCollapsed ? 0 : 1}
                >
                  Task Management
                </Text>
              )}
            </Box>
            <IconButton
              aria-label="Toggle sidebar"
              icon={<AiOutlineMenu />}
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              _hover={{ bg: 'gray.100' }}
            />
          </HStack>

          {/* Main Navigation */}
          <Box 
            as="ul" 
            role="list"
            className="css-16akluc"
            mt={1}
          >
            <NavItem label="Home" to="/" icon={AiOutlineHome} isCollapsed={isCollapsed} />
            <NavItem label="My Tasks" to="/my_tasks/list" icon={AiOutlineInbox} count={5} isCollapsed={isCollapsed} />
            <NavItem label="Inbox" to="/inbox" icon={AiOutlineInbox} count={3} isCollapsed={isCollapsed} />
            <NavItem label="Portfolios" to="/portfolios" icon={AiOutlineFolder} isCollapsed={isCollapsed} />
            <NavItem label="Goals" to="/goals" icon={AiOutlineFlag} isCollapsed={isCollapsed} />
          </Box>

          <Divider my={2} />
        </Box>

        {/* Scrollable Content */}
        <Box
          flex="1"
          overflow="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '4px',
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: useColorModeValue('gray.300', 'gray.600'),
              borderRadius: '24px',
            },
          }}
        >
          {isCollapsed ? (
            <VStack spacing={1} align="stretch" px={1.5}>
              {isLoadingProjects ? (
                // Show loading skeleton for projects
                Array.from({ length: 3 }).map((_, i) => (
                  <Box
                    key={i}
                    height="36px"
                    bg="gray.100"
                    borderRadius="md"
                    animation="pulse 1.5s infinite"
                  />
                ))
              ) : (
                projects.slice(0, 3).map(project => renderProjectItem(project))
              )}
            </VStack>
          ) : (
            <>
              {/* Full content when expanded */}
              <Box px={2}>
                <Accordion defaultIndex={[0]} allowMultiple>
                  <AccordionItem border="none">
                    <AccordionButton 
                      px={0.5} 
                      py={2}
                      _hover={{ bg: 'transparent' }}
                    >
                      <Heading size="xs" flex="1" textAlign="left" color="gray.500">
                        Favorites
                      </Heading>
                      <AccordionIcon color="gray.500" />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={2}>
                      <VStack 
                        as="ul"
                        role="list"
                        align="stretch" 
                        spacing={1}
                      >
                        {isLoadingProjects ? (
                          // Show loading skeleton for projects
                          Array.from({ length: 3 }).map((_, i) => (
                            <Box
                              key={i}
                              height="36px"
                              bg="gray.100"
                              borderRadius="md"
                              animation="pulse 1.5s infinite"
                            />
                          ))
                        ) : (
                          projects
                            .filter(project => project.status === 'active')
                            .slice(0, 3)
                            .map(project => renderProjectItem(project))
                        )}
                        <NavItem label="All Items" to="/all-items" icon={AiOutlineInbox} isCollapsed={false} />
                        <NavItem label="Deleted Items" to="/trash" icon={AiOutlineDelete} isCollapsed={false} />
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>

                  {/* Saved Searches Section */}
                  <AccordionItem border="none">
                    <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                      <Heading size="xs" flex="1" textAlign="left">
                        Saved searches
                      </Heading>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0} pb={4}>
                      <VStack 
                        as="ul"
                        role="list"
                        className="css-5xq7pa"
                        align="stretch" 
                        spacing={1}
                      >
                        <NavItem label="Tasks I've changed" to="/my-changes" icon={AiOutlineSearch} isCollapsed={false} />
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>

              <Divider my={3} />

              {/* Workspace Section */}
              <Box px={3}>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    My Workspace
                  </Text>
                  <IconButton
                    aria-label="Add to workspace"
                    icon={<AiOutlinePlus />}
                    variant="ghost"
                    size="sm"
                  />
                </HStack>

                {/* Team Members */}
                <Wrap spacing={1} mb={3}>
                  <WrapItem>
                    <Avatar size="sm" name="Manato Kuroda" src="/images/cat_img.png" />
                  </WrapItem>
                  <WrapItem>
                    <Avatar size="sm" name="Dan Abrahmov" src="/images/dan.jpg" />
                  </WrapItem>
                  <WrapItem>
                    <Avatar size="sm" name="Kent Dodds" src="/images/kent.jpg" />
                  </WrapItem>
                  <WrapItem>
                    <Avatar size="sm" bg="gray.300" />
                  </WrapItem>
                </Wrap>

                {/* Projects */}
                <VStack align="stretch" spacing={1}>
                  {isLoadingProjects ? (
                    // Show loading skeleton for projects
                    Array.from({ length: 5 }).map((_, i) => (
                      <Box
                        key={i}
                        height="36px"
                        bg="gray.100"
                        borderRadius="md"
                        animation="pulse 1.5s infinite"
                      />
                    ))
                  ) : (
                    activeProjects.map(project => renderProjectItem(project))
                  )}
                </VStack>
              </Box>
            </>
          )}
        </Box>

        {/* Fixed Footer - only shown when expanded */}
        {!isCollapsed && (
          <Box flexShrink={0}>
            <Divider my={2} />
            <VStack align="stretch" spacing={2} px={2.5} pb={3}>
              <Text 
                fontSize="sm" 
                color="gray.600" 
                cursor="pointer" 
                _hover={{ color: 'gray.900' }}
                transition="color 0.2s"
              >
                Invite teammates
              </Text>
              <Text 
                fontSize="sm" 
                color="gray.600" 
                cursor="pointer" 
                _hover={{ color: 'gray.900' }}
                transition="color 0.2s"
              >
                Help & getting started
              </Text>
            </VStack>
          </Box>
        )}
      </MotionFlex>
    </>
  )
} 