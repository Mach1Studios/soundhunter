'use client'

import { motion } from 'framer-motion'
import { MapPinIcon, PlayIcon } from '@heroicons/react/24/outline'

// Mock data for map pins - would typically come from API
const mapPins = [
  { id: 1, lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA', sounds: 234 },
  { id: 2, lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK', sounds: 189 },
  { id: 3, lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan', sounds: 156 },
  { id: 4, lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France', sounds: 143 },
  { id: 5, lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia', sounds: 98 },
  { id: 6, lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany', sounds: 87 },
]

const recentRecordings = [
  {
    id: 1,
    title: 'Morning Market Sounds',
    location: 'Bangkok, Thailand',
    time: '2 hours ago',
    duration: '3:45',
  },
  {
    id: 2,
    title: 'Subway Platform Ambience',
    location: 'New York, USA',
    time: '4 hours ago',
    duration: '2:18',
  },
  {
    id: 3,
    title: 'Café Conversations',
    location: 'Paris, France',
    time: '6 hours ago',
    duration: '5:32',
  },
  {
    id: 4,
    title: 'Rain on Cobblestones',
    location: 'Prague, Czech Republic',
    time: '8 hours ago',
    duration: '4:12',
  },
]

export default function WorldMap() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Sounds Around the World
        </motion.h2>
        <motion.p 
          className="mt-4 text-lg text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover audio recordings from every corner of the globe
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive World Map Placeholder */}
        <motion.div 
          className="lg:col-span-2 card-elevated"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden">
            {/* World Map SVG Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
                <path
                  d="M150,200 Q200,150 300,180 T500,200 Q600,220 700,200 T900,180"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary-400"
                />
                <path
                  d="M100,300 Q200,280 350,300 T600,320 Q750,340 850,320"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary-400"
                />
              </svg>
            </div>

            {/* Map Pins */}
            {mapPins.map((pin, index) => (
              <motion.div
                key={pin.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${(pin.lng + 180) * (100 / 360)}%`,
                  top: `${(90 - pin.lat) * (100 / 180)}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.2 }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-lg group-hover:bg-accent-500 transition-colors duration-200" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white rounded-lg shadow-lg p-3 text-sm whitespace-nowrap">
                      <div className="font-medium text-gray-900">{pin.city}, {pin.country}</div>
                      <div className="text-gray-600">{pin.sounds} recordings</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Floating Stats */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-primary-600">50+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-accent-600">10K+</div>
              <div className="text-sm text-gray-600">Recordings</div>
            </div>

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-sm text-gray-600">Live Updates</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="btn btn-primary">
              Explore Interactive Map
            </button>
          </div>
        </motion.div>

        {/* Recent Recordings */}
        <motion.div 
          className="card-elevated"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Recordings</h3>
          
          <div className="space-y-4">
            {recentRecordings.map((recording, index) => (
              <motion.div
                key={recording.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center group-hover:from-primary-200 group-hover:to-accent-200 transition-colors duration-200">
                    <PlayIcon className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {recording.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPinIcon className="w-3 h-3" />
                    <span className="truncate">{recording.location}</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-500">{recording.time}</p>
                  <p className="text-xs font-medium text-gray-700">{recording.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All Recent Recordings →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}