import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Settings,
  Bell,
  Shield,
  Trash2,
  Download
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Profile = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [measurements, setMeasurements] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = user?.id || 'demo-user'
        
        const [measurementsResponse, recommendationsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/measurements/${userId}`),
          axios.get(`${API_BASE_URL}/api/recommendations/${userId}`)
        ])

        setMeasurements(measurementsResponse.data)
        setRecommendations(recommendationsResponse.data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    })
  }

  const handleSave = () => {
    // In a real app, this would make an API call to update user data
    console.log('Saving user data:', formData)
    setIsEditing(false)
    // Show success message
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const exportData = () => {
    const data = {
      profile: user,
      measurements: measurements,
      recommendations: recommendations
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fitsnap-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'measurements', name: 'Measurements', icon: Calendar },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'privacy', name: 'Privacy', icon: Shield }
  ]

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-dark-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="card-neon">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-6 md:mb-0 md:mr-8">
                <div className="w-24 h-24 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 bg-neon-blue hover:bg-neon-purple text-white p-2 rounded-full transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user?.name || 'User'}
                </h1>
                <p className="text-dark-300 mb-4">{user?.email || 'user@example.com'}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center text-sm text-dark-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined December 2024</span>
                  </div>
                  <div className="flex items-center text-sm text-dark-400">
                    <User className="w-4 h-4 mr-2" />
                    <span>{measurements.length} scans completed</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="btn-neon-outline mr-4"
                >
                  View Dashboard
                </button>
                <button
                  onClick={handleEdit}
                  className="btn-neon"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-dark-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-neon-blue text-neon-blue'
                      : 'border-transparent text-dark-300 hover:text-white hover:border-dark-500'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2 inline" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card-neon">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                      />
                    ) : (
                      <p className="text-dark-300 py-2">{user?.name || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                      />
                    ) : (
                      <p className="text-dark-300 py-2">{user?.email || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleCancel}
                      className="btn-neon-outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn-neon"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="space-y-6">
              <div className="card-neon">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Measurement History</h2>
                  <button
                    onClick={() => window.location.href = '/upload'}
                    className="btn-neon-outline"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    New Scan
                  </button>
                </div>

                {measurements.length > 0 ? (
                  <div className="space-y-4">
                    {measurements.map((measurement, index) => (
                      <div key={measurement.id} className="bg-dark-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">
                            Scan #{measurements.length - index}
                          </h3>
                          <span className="text-sm text-dark-400">
                            {new Date(measurement.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(measurement).map(([key, value]) => {
                            if (key === 'id' || key === 'user_id' || key === 'created_at') return null
                            return (
                              <div key={key} className="text-center">
                                <div className="text-lg font-bold text-neon-blue">
                                  {typeof value === 'number' ? `${value}cm` : value}
                                </div>
                                <div className="text-xs text-dark-300 capitalize">
                                  {key.replace('_', ' ')}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 text-dark-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No measurements yet</h3>
                    <p className="text-dark-300 mb-6">Upload your photos to get started</p>
                    <button
                      onClick={() => window.location.href = '/upload'}
                      className="btn-neon"
                    >
                      Upload Photos
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="card-neon">
                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-dark-700">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Email Notifications</h3>
                      <p className="text-dark-300 text-sm">Receive updates about new features and recommendations</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-neon-blue focus:ring-neon-blue border-dark-600 rounded bg-dark-800"
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-dark-700">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Marketing Emails</h3>
                      <p className="text-dark-300 text-sm">Receive promotional content and special offers</p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-neon-blue focus:ring-neon-blue border-dark-600 rounded bg-dark-800"
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-dark-700">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Data Export</h3>
                      <p className="text-dark-300 text-sm">Download all your data in JSON format</p>
                    </div>
                    <button
                      onClick={exportData}
                      className="btn-neon-outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-lg font-semibold text-red-400">Delete Account</h3>
                      <p className="text-dark-300 text-sm">Permanently delete your account and all data</p>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 mr-2 inline" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="card-neon">
              <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Data Usage</h3>
                  <p className="text-dark-300 mb-4">
                    Your body measurements and photos are used solely for providing size recommendations. 
                    We do not share your personal data with third parties.
                  </p>
                  <ul className="space-y-2 text-sm text-dark-300">
                    <li>• Photos are processed and deleted after analysis</li>
                    <li>• Measurements are stored securely and encrypted</li>
                    <li>• Data is never sold or shared with brands</li>
                    <li>• You can delete your data at any time</li>
                  </ul>
                </div>

                <div className="border-t border-dark-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
                  <p className="text-dark-300 mb-4">
                    Update your password to keep your account secure.
                  </p>
                  <button className="btn-neon-outline">
                    Update Password
                  </button>
                </div>

                <div className="border-t border-dark-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Two-Factor Authentication</h3>
                  <p className="text-dark-300 mb-4">
                    Add an extra layer of security to your account.
                  </p>
                  <button className="btn-neon-outline">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile