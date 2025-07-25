import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  })

  const { register } = useAuth()
  const navigate = useNavigate()

  const validatePassword = (password) => {
    const checks = [
      { test: password.length >= 8, message: 'At least 8 characters' },
      { test: /[A-Z]/.test(password), message: 'One uppercase letter' },
      { test: /[a-z]/.test(password), message: 'One lowercase letter' },
      { test: /\d/.test(password), message: 'One number' },
      { test: /[!@#$%^&*]/.test(password), message: 'One special character' }
    ]

    const passed = checks.filter(check => check.test)
    const failed = checks.filter(check => !check.test)

    return {
      score: passed.length,
      feedback: failed.map(check => check.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError('')

    if (name === 'password') {
      setPasswordStrength(validatePassword(value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (passwordStrength.score < 3) {
      setError('Password is too weak. Please follow the requirements.')
      setIsLoading(false)
      return
    }

    try {
      const result = await register(formData.name, formData.email, formData.password)
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = (score) => {
    if (score <= 2) return 'bg-red-500'
    if (score <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (score) => {
    if (score <= 2) return 'Weak'
    if (score <= 3) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="pt-24 pb-12 min-h-screen flex items-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card-neon"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gradient">Create Account</span>
            </h1>
            <p className="text-dark-300">
              Join FitSnap and find your perfect fit
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <span className="text-red-300">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-colors"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-neon-blue transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center mb-2">
                    <div className="flex-1 bg-dark-700 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-400' :
                      passwordStrength.score <= 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  
                  {passwordStrength.feedback.length > 0 && (
                    <div className="space-y-1">
                      {passwordStrength.feedback.map((feedback, index) => (
                        <div key={index} className="flex items-center text-xs text-dark-400">
                          <div className="w-1 h-1 bg-dark-500 rounded-full mr-2" />
                          {feedback}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-neon-blue transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {formData.confirmPassword && formData.password && (
                <div className="mt-2 flex items-center text-xs">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-green-400">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                      <span className="text-red-400">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 text-neon-blue focus:ring-neon-blue border-dark-600 rounded bg-dark-800"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-dark-300">
                I agree to the{' '}
                <Link to="#" className="text-neon-blue hover:text-neon-purple">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-neon-blue hover:text-neon-purple">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-neon disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-dark-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-neon-blue hover:text-neon-purple font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup