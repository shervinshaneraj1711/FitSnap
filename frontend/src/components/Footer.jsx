import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, Twitter, Instagram, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Mail, href: 'mailto:contact@fitsnap.com', label: 'Email' },
  ]

  const footerLinks = {
    Product: [
      { name: 'Features', href: '/#features' },
      { name: 'Upload', href: '/upload' },
      { name: 'Try-On', href: '/try-on' },
      { name: 'Brands', href: '/brands' },
    ],
    Company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    Support: [
      { name: 'Help Center', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  }

  return (
    <footer className="bg-dark-900/50 backdrop-blur-sm border-t border-dark-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gradient">FitSnap</span>
            </Link>
            <p className="text-dark-300 mb-6 max-w-md">
              Know Your Size. Love Your Fit. Revolutionary body scanning technology 
              for perfect clothing recommendations.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-neon-blue transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-dark-300 hover:text-neon-blue transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-dark-400 text-sm">
            © {currentYear} FitSnap. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              to="#"
              className="text-dark-400 hover:text-neon-blue text-sm transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link
              to="#"
              className="text-dark-400 hover:text-neon-blue text-sm transition-colors duration-300"
            >
              Terms
            </Link>
            <Link
              to="#"
              className="text-dark-400 hover:text-neon-blue text-sm transition-colors duration-300"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer