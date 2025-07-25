import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload as UploadIcon, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  User,
  RotateCcw
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Upload = () => {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [frontImage, setFrontImage] = useState(null)
  const [sideImage, setSideImage] = useState(null)
  const [frontPreview, setFrontPreview] = useState(null)
  const [sidePreview, setSidePreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'

  const handleImageUpload = useCallback((file, type) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === 'front') {
          setFrontImage(file)
          setFrontPreview(e.target.result)
        } else {
          setSideImage(file)
          setSidePreview(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e, type) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files[0], type)
    }
  }, [handleImageUpload])

  const processImages = async () => {
    if (!frontImage || !sideImage) {
      setError('Please upload both front and side images')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('front_image', frontImage)
      formData.append('side_image', sideImage)
      formData.append('user_id', user?.id || 'demo-user')

      const response = await axios.post(
        `${API_BASE_URL}/api/measurements/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setResults(response.data)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetUpload = () => {
    setStep(1)
    setFrontImage(null)
    setSideImage(null)
    setFrontPreview(null)
    setSidePreview(null)
    setResults(null)
    setError(null)
  }

  const ImageUploadBox = ({ type, image, preview, title, instructions }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-neon group hover:border-neon-blue/70 transition-all duration-300"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, type)}
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-dark-300 text-sm mb-4">{instructions}</p>
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={`${type} view`}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2">
              <div className="bg-green-500 text-white p-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <button
              onClick={() => {
                if (type === 'front') {
                  setFrontImage(null)
                  setFrontPreview(null)
                } else {
                  setSideImage(null)
                  setSidePreview(null)
                }
              }}
              className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-dark-600 rounded-lg p-8 hover:border-neon-blue/50 transition-colors">
            <UploadIcon className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <p className="text-dark-400 mb-4">Drag & drop your image here</p>
            <label className="btn-neon-outline cursor-pointer">
              <Camera className="w-4 h-4 mr-2" />
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], type)}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Upload Your Photos</span>
          </h1>
          <p className="text-xl text-dark-300 max-w-3xl mx-auto">
            Take two photos - front and side view. Our AI will analyze your body 
            measurements and provide accurate size recommendations.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= stepNumber
                      ? 'bg-neon-blue text-dark-950'
                      : 'bg-dark-800 text-dark-400'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-all duration-300 ${
                      step > stepNumber ? 'bg-neon-blue' : 'bg-dark-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Instructions */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="card-neon mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Photography Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-neon-blue mb-3">✓ Do</h3>
                  <ul className="space-y-2 text-dark-300">
                    <li>• Stand 3-4 feet from the camera</li>
                    <li>• Wear form-fitting clothes</li>
                    <li>• Use good lighting</li>
                    <li>• Stand straight with arms slightly away from body</li>
                    <li>• Take photos in a plain background</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-3">✗ Don't</h3>
                  <ul className="space-y-2 text-dark-300">
                    <li>• Wear baggy or loose clothing</li>
                    <li>• Take photos in dim lighting</li>
                    <li>• Stand too close or too far</li>
                    <li>• Pose or bend</li>
                    <li>• Use cluttered backgrounds</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                className="btn-neon text-lg"
              >
                I Understand
                <Camera className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Upload Images */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <ImageUploadBox
                type="front"
                image={frontImage}
                preview={frontPreview}
                title="Front View"
                instructions="Stand facing the camera, arms slightly away from body"
              />
              <ImageUploadBox
                type="side"
                image={sideImage}
                preview={sidePreview}
                title="Side View"
                instructions="Stand sideways to the camera, maintain good posture"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-300">{error}</span>
              </motion.div>
            )}

            <div className="text-center">
              <button
                onClick={processImages}
                disabled={!frontImage || !sideImage || isProcessing}
                className="btn-neon text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 mr-2" />
                    Analyze My Body
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete!</h2>
              <p className="text-dark-300">Your body measurements have been calculated.</p>
            </div>

            <div className="card-neon mb-8">
              <h3 className="text-xl font-bold text-white mb-6">Your Measurements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(results.measurements).map(([key, value]) => {
                  if (key === 'id' || key === 'user_id' || key === 'created_at') return null
                  return (
                    <div key={key} className="text-center p-4 bg-dark-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-neon-blue">
                        {typeof value === 'number' ? `${value}cm` : value}
                      </div>
                      <div className="text-sm text-dark-300 capitalize">
                        {key.replace('_', ' ')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetUpload}
                className="btn-neon-outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Upload New Photos
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="btn-neon"
              >
                View Dashboard
                <User className="w-4 h-4 ml-2" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Upload