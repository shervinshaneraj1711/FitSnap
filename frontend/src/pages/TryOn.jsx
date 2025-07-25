import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shirt, 
  Bell, 
  Mail, 
  Sparkles, 
  ArrowRight,
  Zap,
  Eye,
  Wand2,
  Camera
} from 'lucide-react'

const TryOn = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNotifyMe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
    }
  }

  const features = [
    {
      icon: Eye,
      title: 'Realistic Visualization',
      description: 'See exactly how clothes will look on your body with photorealistic rendering'
    },
    {
      icon: Zap,
      title: 'Instant Try-On',
      description: 'No waiting time - instantly preview any outfit with a single click'
    },
    {
      icon: Wand2,
      title: 'Perfect Fit Preview',
      description: 'Visualize how different sizes will fit based on your measurements'
    }
  ]

  const comingSoonFeatures = [
    'AI-powered virtual fitting room',
    'Mix and match different clothing items',
    'Save and share your favorite looks',
    'Size comparison across brands',
    'Seasonal outfit recommendations',
    'Social shopping with friends'
  ]

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mb-8">
            <Shirt className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Virtual Try-On</span>
          </h1>
          
          <p className="text-xl text-dark-300 max-w-3xl mx-auto mb-8">
            Experience the future of online shopping. Try on clothes virtually 
            using your personalized avatar before you buy.
          </p>
          
          <div className="inline-flex items-center bg-neon-purple/10 border border-neon-purple/30 rounded-full px-6 py-3 text-neon-purple">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="font-semibold">Coming Soon</span>
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="card-neon text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-dark-800 rounded-lg p-8 mb-6">
                <div className="w-32 h-40 bg-gradient-to-b from-dark-700 to-dark-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-dark-500" />
                </div>
                <div className="text-dark-400 text-sm">Your Virtual Avatar</div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Virtual Fitting Room</h3>
              <p className="text-dark-300">
                Upload your measurements and see how any outfit looks on your personalized 3D avatar
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-gradient">Revolutionary Features</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="card-neon text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neon-blue/10 rounded-full mb-6 group-hover:bg-neon-blue/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-neon-blue" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-dark-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <div className="card-neon">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              What's Coming Next
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comingSoonFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  className="flex items-center"
                >
                  <div className="w-2 h-2 bg-neon-blue rounded-full mr-4"></div>
                  <span className="text-dark-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notification Signup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card-neon text-center">
            {!isSubscribed ? (
              <>
                <Bell className="w-12 h-12 text-neon-blue mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Be the First to Know
                </h2>
                <p className="text-dark-300 mb-8">
                  Get notified when Virtual Try-On launches. Be among the first 
                  to experience the future of online shopping.
                </p>
                
                <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="btn-neon whitespace-nowrap"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Notify Me
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  You're All Set! 🎉
                </h2>
                <p className="text-dark-300 mb-8">
                  We'll send you an email as soon as Virtual Try-On is ready. 
                  In the meantime, explore our other features!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.href = '/upload'}
                    className="btn-neon"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Photos
                  </button>
                  <button
                    onClick={() => window.location.href = '/brands'}
                    className="btn-neon-outline"
                  >
                    Browse Brands
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TryOn