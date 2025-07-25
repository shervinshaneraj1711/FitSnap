import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Star, 
  ChevronDown,
  Grid,
  List,
  ExternalLink,
  Tag
} from 'lucide-react'
import axios from 'axios'

const Brands = () => {
  const [brands, setBrands] = useState([])
  const [filteredBrands, setFilteredBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/brands`)
        setBrands(response.data)
        setFilteredBrands(response.data)
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  useEffect(() => {
    let filtered = brands

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(brand =>
        brand.categories.includes(selectedCategory)
      )
    }

    setFilteredBrands(filtered)
  }, [searchTerm, selectedCategory, brands])

  const categories = [
    'all',
    ...new Set(brands.flatMap(brand => brand.categories))
  ]

  const BrandCard = ({ brand, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`card-neon group hover:scale-105 transition-all duration-300 ${
        viewMode === 'list' ? 'flex items-center' : ''
      }`}
    >
      {viewMode === 'grid' ? (
        <>
          <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden bg-dark-800">
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="w-full h-32 object-contain p-4 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{brand.name}</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {brand.categories.slice(0, 3).map(category => (
              <span
                key={category}
                className="px-2 py-1 bg-neon-blue/10 text-neon-blue text-xs rounded-full"
              >
                {category}
              </span>
            ))}
            {brand.categories.length > 3 && (
              <span className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded-full">
                +{brand.categories.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm">4.8</span>
            </div>
            <button className="text-neon-blue hover:text-neon-purple transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-shrink-0 mr-4">
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="w-16 h-16 object-contain bg-dark-800 rounded-lg p-2"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{brand.name}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {brand.categories.slice(0, 4).map(category => (
                <span
                  key={category}
                  className="px-2 py-1 bg-neon-blue/10 text-neon-blue text-xs rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm">4.8</span>
            </div>
            <button className="text-neon-blue hover:text-neon-purple transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  )

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
          <p className="text-dark-300">Loading brands...</p>
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Supported Brands</span>
          </h1>
          <p className="text-xl text-dark-300 max-w-3xl mx-auto">
            Get accurate size recommendations from over 500+ popular brands. 
            Find your perfect fit across all your favorite stores.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white hover:border-neon-blue transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="capitalize">{selectedCategory}</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-lg z-10"
                  >
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setShowFilters(false)
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-dark-700 transition-colors capitalize ${
                          selectedCategory === category ? 'text-neon-blue' : 'text-white'
                        }`}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* View Mode Toggle */}
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

          {/* Results count */}
          <div className="flex items-center justify-between text-sm text-dark-300">
            <span>
              Showing {filteredBrands.length} of {brands.length} brands
            </span>
            {selectedCategory !== 'all' && (
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                <span>Filtered by: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 text-neon-blue hover:text-neon-purple"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Brands Grid */}
        {filteredBrands.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredBrands.map((brand, index) => (
              <BrandCard key={brand.id} brand={brand} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="card-neon max-w-md mx-auto">
              <Search className="w-16 h-16 text-dark-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No brands found</h3>
              <p className="text-dark-300 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="btn-neon-outline"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="card-neon max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Don't see your favorite brand?
            </h2>
            <p className="text-dark-300 mb-6">
              We're constantly adding new brands to our platform. 
              Let us know which ones you'd like to see next!
            </p>
            <button className="btn-neon">
              Request a Brand
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Brands