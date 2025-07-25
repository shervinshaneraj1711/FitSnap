import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Scan, 
  Target, 
  Shirt, 
  Star, 
  ArrowRight, 
  Camera,
  Zap,
  Shield,
  Users
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Scan,
      title: 'Body Scan Technology',
      description: 'Advanced AI-powered body scanning using just two photos. Get accurate measurements in seconds.',
      image: 'https://images.unsplash.com/photo-1637249786345-a064129dd0d2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxib2R5JTIwc2Nhbm5pbmd8ZW58MHx8fGJsdWV8MTc1MzQxOTI1MHww&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: Target,
      title: 'Smart Size Recommender',
      description: 'Get personalized size recommendations for 500+ brands. Never buy the wrong size again.',
      image: 'https://images.unsplash.com/photo-1520495797713-e1211498d977?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxmaXRuZXNzJTIwYXBwfGVufDB8fHxibHVlfDE3NTM0MTkyNjN8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      icon: Shirt,
      title: 'Virtual Try-On',
      description: 'See how clothes look on your virtual avatar before purchasing. Coming soon!',
      image: 'https://images.unsplash.com/photo-1563866475778-c7e145291626?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxib2R5JTIwc2Nhbm5pbmd8ZW58MHx8fGJsdWV8MTc1MzQxOTI1MHww&ixlib=rb-4.1.0&q=85'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Fashion Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b45c1e6f?w=150&h=150&fit=crop&crop=face',
      content: 'FitSnap completely changed how I shop online. I haven\'t had a size issue since using it!',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Fitness Coach',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'The accuracy is incredible. As someone who works out regularly, getting the right fit is crucial.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Online Shopper',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'Finally, a solution to online shopping size anxiety. This app is a game-changer!',
      rating: 5
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-white">Know Your Size.</span>
                <span className="block text-gradient">Love Your Fit.</span>
              </h1>
              
              <p className="mt-6 text-xl text-dark-300 max-w-xl">
                Revolutionary body scanning technology that gives you perfect size 
                recommendations for any brand. Say goodbye to returns and hello to 
                perfect fits.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/upload" className="btn-neon text-lg">
                  <Camera className="w-5 h-5 mr-2" />
                  Start Scanning
                </Link>
                <Link to="/brands" className="btn-neon-outline text-lg">
                  View Brands
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>

              <div className="mt-8 flex items-center space-x-8 text-sm text-dark-400">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-neon-blue" />
                  <span>50K+ Users</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-neon-green" />
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-neon-purple" />
                  <span>Instant Results</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            >
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-dark-900 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue">
                  <img
                    className="w-full h-96 object-cover"
                    src="https://images.unsplash.com/photo-1520495797713-e1211498d977?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxmaXRuZXNzJTIwYXBwfGVufDB8fHxibHVlfDE3NTM0MTkyNjN8MA&ixlib=rb-4.1.0&q=85"
                    alt="FitSnap Hero"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-dark-900/80 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-neon-blue text-sm font-semibold">Perfect Fit Guarantee</div>
                      <div className="text-white text-xs">95% accuracy rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-dark-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Revolutionary Features</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-3xl mx-auto">
              Cutting-edge technology meets fashion to deliver the most accurate 
              size recommendations in the industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-neon group hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue mr-3">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </div>
                
                <p className="text-dark-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">What Our Users Say</span>
            </h2>
            <p className="text-xl text-dark-300">
              Join thousands of satisfied customers who found their perfect fit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-neon"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-dark-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-dark-300 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-teal/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Ready to Find Your Perfect Fit?</span>
            </h2>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who never have to worry about online shopping 
              sizes again. Get started in less than 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload" className="btn-neon text-lg">
                <Camera className="w-5 h-5 mr-2" />
                Start Your Scan
              </Link>
              <Link to="/signup" className="btn-neon-outline text-lg">
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home