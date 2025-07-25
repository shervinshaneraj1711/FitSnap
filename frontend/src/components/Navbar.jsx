import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Upload', path: '/upload' },
    { name: 'Try-On', path: '/try-on' },
    { name: 'Brands', path: '/brands' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-md border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-gradient"
            >
              FitSnap
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`nav-link ${
                    isActive(link.path) ? 'text-neon-blue' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-dark-300 hover:text-neon-blue transition-colors duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="btn-neon-outline text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-dark-300 hover:text-red-400 transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-dark-300 hover:text-neon-blue transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-neon text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark-300 hover:text-neon-blue transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-dark-900/95 backdrop-blur-md"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 text-base font-medium transition-colors duration-300 ${
                isActive(link.path)
                  ? 'text-neon-blue'
                  : 'text-dark-300 hover:text-neon-blue'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="border-t border-dark-700 pt-4 mt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-dark-300 hover:text-neon-blue transition-colors duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name || 'Profile'}</span>
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-neon-blue"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 w-full text-left text-base font-medium text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-dark-300 hover:text-neon-blue transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-neon-blue"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  )
}

export default Navbar