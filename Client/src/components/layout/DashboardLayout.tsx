import {
  Box,
  Flex,
} from '@chakra-ui/react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from '../../pages/Home'
import MyTasks from '../../pages/MyTasks'
import Inbox from '../../pages/Inbox'
import Portfolios from '../../pages/Portfolios'
import Goals from '../../pages/Goals'
import ProjectTasks from '../../pages/ProjectTasks'
import { useState, useEffect } from 'react'
import { pageConfigs } from '../../config/pageConfig'
import { motion, AnimatePresence } from 'framer-motion'

const MotionFlex = motion(Flex)

export default function DashboardLayout() {
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState<string>('')
  const [currentView, setCurrentView] = useState<'list' | 'board' | 'calendar'>('list')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Update current tab when route changes
  useEffect(() => {
    const currentPage = pageConfigs[location.pathname]
    if (currentPage?.defaultTab) {
      setCurrentTab(currentPage.defaultTab)
    }
  }, [location.pathname])

  // Handle view changes for tasks
  const handleViewChange = (view: 'list' | 'board' | 'calendar') => {
    setCurrentView(view)
  }

  return (
    <Flex w="100vw" h="100vh" overflow="hidden" position="fixed" top={0} left={0}>
      {/* Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        w={isSidebarCollapsed ? "60px" : "240px"}
        transition="width 0.2s"
        zIndex={2}
      >
        <Sidebar 
          onCollapse={(collapsed: boolean) => setIsSidebarCollapsed(collapsed)} 
        />
      </Box>

      {/* Main Content */}
      <MotionFlex
        position="absolute"
        left={isSidebarCollapsed ? "60px" : "240px"}
        top={0}
        right={0}
        bottom={0}
        direction="column"
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
        bg="gray.50"
      >
        {/* Header */}
        <Box 
          h="72px" 
          w="100%"
          borderBottom="1px" 
          borderColor="gray.200"
          bg="white"
          position="sticky"
          top={0}
          zIndex={1}
        >
          <Header
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            viewType={currentView}
            onViewChange={handleViewChange}
          />
        </Box>

        {/* Page Content */}
        <Box 
          flex={1} 
          w="100%"
          overflowY="auto"
          position="relative"
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my_tasks" element={<Navigate to="/my_tasks/list" replace />} />
              <Route 
                path="/my_tasks/:view" 
                element={
                  <MyTasks 
                    currentView={currentView}
                    onViewChange={handleViewChange}
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                  />
                } 
              />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/portfolios" element={<Portfolios />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/projects/:projectId/tasks" element={<ProjectTasks />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Box>
      </MotionFlex>
    </Flex>
  )
} 