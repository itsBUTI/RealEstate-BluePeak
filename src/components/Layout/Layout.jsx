import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import { Navbar } from '../Navigation/Navbar.jsx'
import { Footer } from './Footer.jsx'
import { ChatWidget } from '../Chatbot/ChatWidget.jsx'

export function Layout() {
  const location = useLocation()
  const MotionDiv = motion.div

  return (
    <div className="min-h-dvh bg-surface-50">
      <Navbar />
      <main className="pt-16 overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <MotionDiv
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </MotionDiv>
        </AnimatePresence>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
