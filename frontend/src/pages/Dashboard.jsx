import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Grid, 
  List, 
  Ruler, 
  Star, 
  Calendar,
  TrendingUp,
  Target,
  ShoppingBag
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState('grid')
  const [measurements, setMeasurements] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user?.id || 'demo-user'
        
        const [measurementsResponse, recommendationsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/measurements/${userId}`),
          axios.get(`${API_BASE_URL}/api/recommendations/${userId}`)
        ])

        setMeasurements(measurementsResponse.data)
        setRecommendations(recommendationsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const latestMeasurements = measurements.length > 0 ? measurements[0] : null

  const measurementCards = latestMeasurements ? [
    { key: 'chest', label: 'Chest', value: latestMeasurements.chest, unit: 'cm', icon: '👕' },
    { key: 'waist', label: 'Waist', value: latestMeasurements.waist, unit: 'cm', icon: '📏' },
    { key: 'hips', label: 'Hips', value: latestMeasurements.hips, unit: 'cm', icon: '📐' },
    { key: 'height', label: 'Height', value: latestMeasurements.height, unit: 'cm', icon: '📏' },
    { key: 'weight', label: 'Weight', value: latestMeasurements.weight, unit: 'kg', icon: '⚖️' },
    { key: 'shoulder_width', label: 'Shoulder Width', value: latestMeasurements.shoulder_width, unit: 'cm', icon: '📐' },
    { key: 'arm_length', label: 'Arm Length', value: latestMeasurements.arm_length, unit: 'cm', icon: '💪' },
    { key: 'leg_length', label: 'Leg Length', value: latestMeasurements.leg_length, unit: 'cm', icon: '🦵' },
  ] : []

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-dark-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                <span className="text-gradient">Dashboard</span>
              </h1>
              <p className="text-xl text-dark-300">
                Welcome back, {user?.name || 'User'}! Here's your fit profile.
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center bg-dark-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-neon-blue text-dark-950'
                      : 'text-dark-300 hover:text-neon-blue'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-neon-blue text-dark-950'
                      : 'text-dark-300 hover:text-neon-blue'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-neon"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-neon-blue/10 text-neon-blue mr-4">
                <Ruler className="w-6 h-6" />
              </div>
              <div>
                <p className="text-dark-300 text-sm">Scans Completed</p>
                <p className="text-2xl font-bold text-white">{measurements.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-neon"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-neon-purple/10 text-neon-purple mr-4">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-dark-300 text-sm">Size Recommendations</p>
                <p className="text-2xl font-bold text-white">{recommendations.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card-neon"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-neon-teal/10 text-neon-teal mr-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-dark-300 text-sm">Accuracy Rate</p>
                <p className="text-2xl font-bold text-white">95%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-neon"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-neon-green/10 text-neon-green mr-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-dark-300 text-sm">Perfect Fits</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Body Measurements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Measurements</h2>
            {latestMeasurements && (
              <div className="flex items-center text-dark-300 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Last updated: {new Date(latestMeasurements.created_at).toLocaleDateString()}
              </div>
            )}
          </div>

          {measurementCards.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {measurementCards.map((measurement, index) => (
                <motion.div
                  key={measurement.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`card-neon ${
                    viewMode === 'list' ? 'flex items-center' : 'text-center'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="text-2xl mb-2">{measurement.icon}</div>
                      <div className="text-2xl font-bold text-neon-blue mb-1">
                        {measurement.value}{measurement.unit}
                      </div>
                      <div className="text-dark-300 text-sm">{measurement.label}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl mr-4">{measurement.icon}</div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold text-white">{measurement.label}</div>
                        <div className="text-dark-300 text-sm">Body measurement</div>
                      </div>
                      <div className="text-2xl font-bold text-neon-blue">
                        {measurement.value}{measurement.unit}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card-neon text-center py-12">
              <User className="w-16 h-16 text-dark-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No measurements yet</h3>
              <p className="text-dark-300 mb-6">Upload your photos to get started with body measurements</p>
              <button
                onClick={() => window.location.href = '/upload'}
                className="btn-neon"
              >
                Upload Photos
              </button>
            </div>
          )}
        </motion.div>

        {/* Size Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Size Recommendations</h2>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="card-neon"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{rec.brand}</h3>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="text-sm">{Math.round(rec.confidence * 100)}%</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-dark-300 text-sm mb-1">{rec.category}</p>
                    <p className="text-2xl font-bold text-neon-blue">{rec.recommended_size}</p>
                  </div>
                  
                  <div className="text-xs text-dark-400">
                    Recommended on {new Date(rec.created_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card-neon text-center py-12">
              <Target className="w-16 h-16 text-dark-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
              <p className="text-dark-300 mb-6">Complete your body scan to get personalized size recommendations</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/upload'}
                  className="btn-neon"
                >
                  Upload Photos
                </button>
                <button
                  onClick={() => window.location.href = '/brands'}
                  className="btn-neon-outline"
                >
                  Browse Brands
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard