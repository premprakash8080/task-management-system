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
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <Sidebar 
        onCollapse={(collapsed: boolean) => setIsSidebarCollapsed(collapsed)} 
      />

      {/* Main Content */}
      <MotionFlex
        flex={1}
        direction="column"
        initial={false}
        animate={{
          marginLeft: isSidebarCollapsed ? '60px' : '240px',
          width: `calc(100% - ${isSidebarCollapsed ? '60px' : '240px'})`
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
      >
        {/* Header */}
        <Box 
          h="72px" 
          borderBottom="1px" 
          borderColor="gray.200"
          bg="white"
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
          overflowY="auto"
          bg="gray.50"
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Box>
      </MotionFlex>
    </Flex>
  )
} 